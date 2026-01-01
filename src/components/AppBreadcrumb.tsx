import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useMatches } from '@tanstack/react-router'
import { Fragment } from 'react'

export function AppBreadcrumb() {
  const matches = useMatches()
  const breadcrumbItems = matches
    .filter((match) => match.loaderData?.crumb)
    .map(({ pathname, loaderData }) => ({
      href: pathname,
      label: loaderData?.crumb,
    }))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((crumb, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
