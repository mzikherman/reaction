import { routes_OverviewQueryRendererQueryResponse } from "__generated__/routes_OverviewQueryRendererQuery.graphql"
import {
  FilterState,
  initialState,
  isDefaultFilter,
} from "Apps/Artist/Routes/Overview/state"
import { Redirect, RouteConfig } from "found"
import React from "react"
import { graphql } from "react-relay"
import { Provider } from "unstated"
import { ArtistAppFragmentContainer as ArtistApp } from "./ArtistApp"
import { ArticlesRouteFragmentContainer as ArticlesRoute } from "./Routes/Articles"
import { AuctionResultsRouteFragmentContainer as AuctionResultsRoute } from "./Routes/AuctionResults"
import { CVRouteFragmentContainer as CVRoute } from "./Routes/CV"
import { OverviewRouteFragmentContainer as OverviewRoute } from "./Routes/Overview"
import { ShowsRouteFragmentContainer as ShowsRoute } from "./Routes/Shows"

// FIXME:
// * `render` functions requires casting
// * `Redirect` needs to be casted, as it’s not compatible with `RouteConfig`
export const routes: RouteConfig[] = [
  {
    path: "/artist/:artistID",
    Component: ArtistApp,
    query: graphql`
      query routes_ArtistTopLevelQuery($artistID: String!) {
        artist(id: $artistID) {
          ...ArtistApp_artist
        }
      }
    `,
    children: [
      {
        path: "/",
        Component: OverviewRoute,
        render: ({ props, Component }) => {
          if (!props) {
            return null
          }

          return (
            <Provider inject={[new FilterState(props.location.query as any)]}>
              <Component
                artist={
                  (props as any)
                    .artist as routes_OverviewQueryRendererQueryResponse
                }
              />
            </Provider>
          )
        },
        prepareVariables: (params, props) => {
          // FIXME: The initial render includes `location` in props, but subsequent
          // renders (such as tabbing back to this route in your browser) will not.
          const filterStateFromUrl = props.location ? props.location.query : {}
          const filterParams = {
            ...initialState,
            ...filterStateFromUrl,
            ...params,
          }

          Object.entries(filterStateFromUrl).map(([k, v]) => {
            if (!isDefaultFilter(k, v)) {
              filterParams.hasFilter = true
              return
            }
          })

          return filterParams
        },
        query: graphql`
          query routes_OverviewQueryRendererQuery(
            $artistID: String!
            $medium: String
            $major_periods: [String]
            $partner_id: ID
            $for_sale: Boolean
            $sort: String
            $at_auction: Boolean
            $acquireable: Boolean
            $offerable: Boolean
            $inquireable_only: Boolean
            $price_range: String
            $page: Int
            $hasFilter: Boolean!
          ) {
            artist(id: $artistID) {
              ...Overview_artist
                @arguments(
                  medium: $medium
                  major_periods: $major_periods
                  partner_id: $partner_id
                  for_sale: $for_sale
                  sort: $sort
                  at_auction: $at_auction
                  acquireable: $acquireable
                  inquireable_only: $inquireable_only
                  offerable: $offerable
                  price_range: $price_range
                  page: $page
                  hasFilter: $hasFilter
                )
            }
          }
        `,
      },
      {
        path: "cv",
        Component: CVRoute,
        query: graphql`
          query routes_CVQuery($artistID: String!) {
            viewer {
              ...CV_viewer
            }
          }
        `,
      },
      {
        path: "articles",
        Component: ArticlesRoute,
        query: graphql`
          query routes_ArticlesQuery($artistID: String!) {
            artist(id: $artistID) {
              ...Articles_artist
            }
          }
        `,
      },
      {
        path: "shows",
        Component: ShowsRoute,
        query: graphql`
          query routes_ShowsQuery($artistID: String!) {
            viewer {
              ...Shows_viewer
            }
          }
        `,
      },
      {
        path: "auction-results",
        Component: AuctionResultsRoute,
        query: graphql`
          query routes_AuctionResultsQuery($artistID: String!) {
            artist(id: $artistID) {
              ...AuctionResults_artist
            }
          }
        `,
      },
      // Redirect all unhandled tabs to the artist page.
      // Note: there is a deep-linked standalone auction-lot page
      // in Force, under /artist/:artistID/auction-result/:id.
      // That app needs to be mounted before this app for that to work,
      // and not get caught here.
      new Redirect({
        from: "*",
        to: "/artist/:artistID",
      }) as any,
    ],
  },
]
