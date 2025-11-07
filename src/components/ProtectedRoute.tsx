interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // /v1/auth/@me 체크 제거, 항상 children 렌더링
  return <>{children}</>;
}
