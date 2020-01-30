import {
  Box,
  Button,
  Flex,
  Image,
  LargePagination,
  Link,
  Sans,
  Serif,
  Spinner,
  StackableBorderBox,
} from "@artsy/palette"
import { PurchaseHistory_me } from "__generated__/PurchaseHistory_me.graphql"
import React, { useState } from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { get } from "Utils/get"

interface OrderRowProps {
  order: PurchaseHistory_me["orders"]["edges"][number]["node"]
}
const OrderRow = (props: OrderRowProps) => {
  const { order } = props
  const artwork = get(order, o => o.lineItems.edges[0].node.artwork)

  if (!artwork) {
    return null
  }

  return (
    <Box py={1}>
      <StackableBorderBox
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex width="350px">
          <Flex height="auto" alignItems="center" mr={2}>
            <Image src={get(artwork, a => a.image.resized.url)} width="55px" />
          </Flex>
          <Flex flexDirection="column" justifyContent="center">
            <Link
              href={`/orders/${order.internalID}/status`}
              underlineBehavior="hover"
            >
              <Serif size="2" weight="semibold">
                {artwork.artist_names}
              </Serif>
            </Link>
            <Serif italic size="2" color="black60" lineHeight={1.3}>
              {artwork.title}, {artwork.date}
            </Serif>
          </Flex>
        </Flex>
        <Flex flexDirection="column" justifyContent="center">
          <Sans
            size="2"
            weight="medium"
            style={{ textTransform: "capitalize" }}
          >
            {order.mode.toLowerCase()}
          </Sans>
          <Sans
            size="2"
            color="black60"
            style={{ textTransform: "capitalize" }}
          >
            {order.state.toLowerCase()}
          </Sans>
        </Flex>
        <Flex>
          <Link
            href={`/orders/${order.internalID}/status`}
            underlineBehavior="hover"
          >
            <Button variant="secondaryGray">View details</Button>
          </Link>
        </Flex>
      </StackableBorderBox>
    </Box>
  )
}

const PAGE_SIZE = 3

const loadNext = (pageInfo, relay, setLoading) => {
  const { hasNextPage, endCursor } = pageInfo

  if (hasNextPage) {
    loadAfter(endCursor, relay, setLoading)
  }
}

const loadAfter = (cursor, relay, setLoading) => {
  setLoading(true)

  relay.refetch(
    {
      first: PAGE_SIZE,
      after: cursor,
      before: null,
      last: null,
    },
    null,
    error => {
      setLoading(false)

      if (error) {
        console.error(error)
      }
    }
  )
}
interface PurchaseHistoryProps {
  me: PurchaseHistory_me
  relay: RelayRefetchProp
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = (
  props: PurchaseHistoryProps
) => {
  const [loading, setLoading] = useState(false)
  const {
    me: { orders },
  } = props
  console.log("historyProps", props)
  const pageInfo = orders.pageInfo
  const myOrders = orders.edges && orders.edges.map(x => x.node)
  console.log(JSON.stringify(myOrders))
  return !loading ? (
    <Box px={1}>
      {myOrders.length ? (
        myOrders.map(order => <OrderRow key={order.code} order={order} />)
      ) : (
        <Sans size="2">No Orders</Sans>
      )}
      <LargePagination
        pageCursors={orders.pageCursors}
        hasNextPage
        onClick={cursor => loadAfter(cursor, props.relay, setLoading)}
        onNext={() => loadNext(pageInfo, props.relay, setLoading)}
      />
    </Box>
  ) : (
    <Spinner />
  )
}

export const PurchaseHistoryFragmentContainer = createRefetchContainer(
  PurchaseHistory,
  {
    me: graphql`
      fragment PurchaseHistory_me on Me
        @argumentDefinitions(
          first: { type: "Int", defaultValue: 3 }
          after: { type: "String" }
        ) {
        orders(first: $first, after: $after) {
          edges {
            node {
              internalID
              code
              state
              mode
              buyerTotal
              lineItems {
                edges {
                  node {
                    artwork {
                      date
                      image {
                        resized(width: 55) {
                          url
                        }
                      }
                      internalID
                      title
                      artist_names: artistNames
                    }
                  }
                }
              }
            }
          }
          pageCursors {
            around {
              cursor
              isCurrent
              page
            }
            first {
              cursor
              isCurrent
              page
            }
            last {
              cursor
              isCurrent
              page
            }
            previous {
              cursor
              isCurrent
              page
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    `,
  },
  graphql`
    query PurchaseHistoryQuery($first: Int!, $after: String) {
      me {
        ...PurchaseHistory_me @arguments(first: $first, after: $after)
      }
    }
  `
)
