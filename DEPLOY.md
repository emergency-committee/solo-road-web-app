# 배포 (Netlify → AWS S3 + CloudFront)

`soloroad.site` 도메인은 그대로 유지하면서 호스팅만 Netlify에서 AWS S3 + CloudFront로 옮긴다.
빌드/업로드/캐시 무효화는 `.github/workflows/deploy.yml`이 자동으로 하고, 이 문서는 그 워크플로우가
동작하기 위해 **AWS 콘솔/CLI에서 한 번만 직접 준비해야 하는 것들**을 정리한다.

## 1. S3 버킷

- 버킷을 만든다 (예: `soloroad-web-app`). **정적 웹사이트 호스팅 기능은 켜지 않는다** — CloudFront가
  Origin Access Control(OAC)로 private 버킷에 직접 접근하는 구성이 퍼블릭 버킷보다 안전하다.
- Block Public Access: 전부 켠 상태 유지.
- 버킷 정책은 CloudFront 배포를 만들 때 콘솔이 "Update bucket policy" 버튼으로 자동 생성해준다
  (OAC principal만 허용).

## 2. ACM 인증서

- **us-east-1 리전**에서 `soloroad.site` + `www.soloroad.site`용 인증서 발급 (CloudFront는 us-east-1
  인증서만 붙일 수 있다). DNS 검증.

## 3. CloudFront 배포

- Origin: 위 S3 버킷, Origin access = Origin access control (OAC) 새로 생성.
- Viewer protocol policy: Redirect HTTP to HTTPS.
- Alternate domain names(CNAMEs): `soloroad.site`, `www.soloroad.site` + 위 ACM 인증서 연결.
- **Default root object**: `index.html`
- **Custom error responses** (SPA 클라이언트 라우팅 폴백 — TanStack Router가 딥링크/새로고침을
  처리하려면 필수):
  - HTTP 403 → Response page path `/index.html`, HTTP Response Code `200`
  - HTTP 404 → Response page path `/index.html`, HTTP Response Code `200`
- 배포가 끝나면 도메인(`dxxxxxxxxxxxxx.cloudfront.net`)이 나온다. DNS 컷오버 전에 이 도메인으로
  먼저 접속 테스트할 것 (아래 5번 CORS 참고).

## 4. DNS

- `soloroad.site`, `www.soloroad.site`를 Netlify가 아니라 CloudFront 배포 도메인으로 가리키도록
  변경 (Route53이면 Alias record, 외부 DNS면 CNAME/ALIAS).
- 전환 직후 문제 생기면 바로 되돌릴 수 있게, Netlify 쪽 배포는 컷오버 후 며칠 그대로 살려두는 걸
  추천.

## 5. GitHub Actions용 IAM Role (OIDC, 액세스 키 저장 안 함)

정적 키를 GitHub Secrets에 넣는 대신, GitHub의 OIDC 토큰으로 임시 자격증명을 발급받는 Role을
만든다.

**IAM Identity Provider** (계정에 하나만 있으면 됨): `token.actions.githubusercontent.com`,
audience `sts.amazonaws.com`.

**Trust policy** (Role 생성 시, `ORG/REPO`를 실제 GitHub org/repo로 교체):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        "StringLike": { "token.actions.githubusercontent.com:sub": "repo:ORG/solo-road-web-app:ref:refs/heads/main" }
      }
    }
  ]
}
```

**Permissions policy** (버킷/배포 ARN 교체):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::soloroad-web-app", "arn:aws:s3:::soloroad-web-app/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

## 6. GitHub 저장소 설정

Settings → Environments → `production` 환경을 만들고 (워크플로우가 `environment: production`을
쓰므로) 아래 값을 채운다.

| 종류      | 이름                          | 값                                            |
| --------- | ----------------------------- | ---------------------------------------------- |
| Secret    | `AWS_ROLE_ARN`                 | 5번에서 만든 Role ARN                          |
| Secret    | `VITE_KAKAO_REST_API_KEY`      | 카카오 REST API 키                             |
| Secret    | `VITE_KAKAO_JS_KEY`            | 카카오 JavaScript 키                           |
| Variable  | `AWS_REGION`                   | 예: `ap-northeast-2`                           |
| Variable  | `S3_BUCKET`                    | 1번 버킷 이름                                  |
| Variable  | `CLOUDFRONT_DISTRIBUTION_ID`   | 3번 배포 ID                                    |
| Variable  | `VITE_API_BASE_URL`            | `https://api.soloroad.site`                    |

## 7. 백엔드 CORS

최종 도메인이 지금과 같은 `https://soloroad.site` / `https://www.soloroad.site`이므로
`SecurityConfig.corsConfigurationSource()`는 **수정할 필요 없음**.

DNS 컷오버 전에 CloudFront 기본 도메인(`*.cloudfront.net`)으로 먼저 스모크 테스트하고 싶다면,
배포 ID가 나온 뒤 그 도메인 하나만 임시로 `allowedOriginPatterns`에 추가하고 컷오버 후 제거할 것 —
`allowCredentials(true)`라서 와일드카드(`https://*.cloudfront.net`)로 넣으면 다른 사람의 CloudFront
배포도 쿠키를 실어 API를 호출할 수 있게 되므로 반드시 우리 배포 도메인 하나만 정확히 넣는다.

## 8. 카카오 디벨로퍼스

도메인이 그대로라 REST API 키/JS 키의 등록된 도메인·Redirect URI는 손댈 필요 없음. 위 7번처럼
CloudFront 기본 도메인으로 임시 테스트할 경우, 지도가 안 뜨거나 카카오 로그인이 막힐 수 있으니
그 동안은 `VITE_KAKAO_JS_KEY` 플랫폼 도메인에 그 주소도 임시로 추가해야 한다.

## 9. 첫 배포 후 확인할 것

- [ ] `https://<distribution>.cloudfront.net/` 루트 접속 시 앱 로드됨
- [ ] 존재하지 않는 하위 경로로 새로고침해도(예: `/course/123`) 404 대신 앱이 뜸 (3번 커스텀 에러
      응답 확인)
- [ ] 로그인/API 호출이 CORS 에러 없이 동작함 (7번)
- [ ] PWA 설치 배너/서비스워커가 새 도메인에서도 정상 등록됨 (`dev-dist`가 아니라 `dist`의 `sw.js`가
      no-cache로 서빙되는지 Network 탭에서 확인)
- [ ] DNS 컷오버 후 `soloroad.site`가 CloudFront를 가리키는지, Netlify 쪽은 그대로 백업으로 남아있는지
