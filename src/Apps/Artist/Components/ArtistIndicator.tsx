import { color, Flex, Sans } from "@artsy/palette"
import React from "react"

import {
  AuctionIcon,
  BlueChipIcon,
  TopEmergingIcon,
  TopEstablishedIcon,
} from "@artsy/palette"
import styled from "styled-components"

interface ArtistIndicatorProps {
  type: string
  label: string
}

const ICON_MAPPING = {
  "high-auction": AuctionIcon,
  "blue-chip": BlueChipIcon,
  "top-established": TopEstablishedIcon,
  "top-emerging": TopEmergingIcon,
}

const RoundedFlex = styled(Flex)`
  border-radius: 100px;
`

export class ArtistIndicator extends React.Component<ArtistIndicatorProps> {
  renderIcon(insightType) {
    const Component = ICON_MAPPING[insightType]

    return <Component pr={5} />
  }

  render() {
    const { label, type } = this.props

    return (
      <RoundedFlex
        background={color("black5")}
        width="auto"
        py={5}
        px={10}
        mt={1}
      >
        {this.renderIcon(type)}
        <Sans size="2">{label}</Sans>
      </RoundedFlex>
    )
  }
}
