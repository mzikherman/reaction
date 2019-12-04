import { Separator } from "@artsy/palette"
import { Box, Flex } from "@artsy/palette"
import { HorizontalPadding } from "Apps/Components/HorizontalPadding"
import { useSystemContext } from "Artsy"
import React from "react"
import { LazyLoadComponent } from "react-lazy-load-image-component"

import {
  Footer,
  RecentlyViewedQueryRenderer as RecentlyViewed,
} from "Components/v2"
import { getENV } from "Utils/getENV"

export interface Props {
  name?: string
}

export const FrameWithRecentlyViewed: React.SFC<Props> = ({ children }) => {
  const { isEigen } = useSystemContext()
  const EXPERIMENTAL_APP_SHELL = getENV("EXPERIMENTAL_APP_SHELL")
  const showFooter = !(isEigen || EXPERIMENTAL_APP_SHELL)

  return (
    <HorizontalPadding>
      <Flex flexDirection="column">
        {children}

        {typeof window !== "undefined" && (
          <LazyLoadComponent threshold={1000}>
            <RecentlyViewed />
          </LazyLoadComponent>
        )}
        <Separator mt={6} mb={3} />

        {showFooter && (
          <Box>
            <Footer />
          </Box>
        )}
      </Flex>
    </HorizontalPadding>
  )
}
