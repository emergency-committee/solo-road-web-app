import { useKakaoLogin } from '../hooks/use-kakao-login'

export function KakaoLoginButton() {
  const { startLogin } = useKakaoLogin()

  return (
    <button
      type="button"
      onClick={startLogin}
      className="bg-kakao-yellow gap-sm relative flex h-14 w-full items-center justify-center rounded-xl shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
    >
      <svg
        className="size-6 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3C6.477 3 2 6.551 2 10.933C2 13.84 3.737 16.368 6.4 17.766L5.3 21.681C5.239 21.895 5.485 22.062 5.674 21.942L10.334 18.966C10.876 19.034 11.433 19.07 12 19.07C17.523 19.07 22 15.519 22 11.137C22 6.755 17.523 3 12 3Z"
          fill="#3C1E1E"
        />
      </svg>
      <span className="text-kakao-text font-body-md text-body-md font-semibold">
        카카오로 시작하기
      </span>
    </button>
  )
}
