import { storiesOf } from "@storybook/react"
import * as React from "react"
import { graphql } from "react-relay/compat"

import { RootQueryRenderer } from "../../Relay/RootQueryRenderer"
import Gene from "../Gene"
import ArtistRow from "../Gene/ArtistRow"

function GeneExample(props: { geneID: string }) {
  return (
    <RootQueryRenderer
      query={graphql`
        query GeneQuery($geneID: String!) {
          gene(id: $geneID) {
            ...Gene_gene
          }
        }
      `}
      variables={{ artistID: props.geneID }}
      render={readyState => readyState.props && <Gene {...readyState.props as any} />}
    />
  )
}

function ArtistExample(props: { artistID: string }) {
  return (
    <RootQueryRenderer
      query={graphql`
        query GeneArtistRowQuery($artistID: String!) {
          artist(id: $artistID) {
            ...ArtistRow_artist
          }
        }
      `}
      variables={{ artistID: props.artistID }}
      render={readyState => readyState.props && <ArtistRow {...readyState.props as any} />}
    />
  )
}

storiesOf("Components/Rows/Gene", module)
  .add("Gene Row - Artist: Stephen Willats", () => {
    return (
      <div>
        <ArtistExample artistID="stephen-willats" />
      </div>
    )
  })
  .add("Gene Row - Artist: Banksy", () => {
    return (
      <div>
        <ArtistExample artistID="banksy" />
      </div>
    )
  })
  .add("Gene Row - Artist: Glenn Brown", () => {
    return (
      <div>
        <ArtistExample artistID="glenn-brown" />
      </div>
    )
  })

storiesOf("Components/Pages/Gene", module)
  .add("Integration - Minimalism", () => {
    return (
      <div>
        <GeneExample geneID="minimalism" />
      </div>
    )
  })
  .add("Integration - The Fantastic", () => {
    return (
      <div>
        <GeneExample geneID="the-fantastic" />
      </div>
    )
  })
  .add("Integration - Old Master Influenced Fantasy", () => {
    return (
      <div>
        <GeneExample geneID="old-master-influenced-fantasy" />
      </div>
    )
  })
