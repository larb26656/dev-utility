import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
