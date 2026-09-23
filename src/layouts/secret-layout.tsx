import { Outlet } from '@tanstack/react-router'

export default function SecretLayout() {
  return (
    <div className="container mx-auto p-4 sm:p-8 text-center relative z-10 max-w-screen w-xl min-w-fit h-full justify-center items-center flex">
      <Outlet />
    </div>
  )
}
