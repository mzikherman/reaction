import { PurchaseApp_me } from "__generated__/PurchaseApp_me.graphql"
import { AppContainer } from "Apps/Components/AppContainer"
import { SystemContext } from "Artsy"
import { ErrorPage } from "Components/ErrorPage"
import React, { useContext } from "react"
import { Title } from "react-head"
import { createFragmentContainer, graphql } from "react-relay"
import { userIsAdmin } from "Utils/user"
import { PurchaseHistoryFragmentContainer as PurchaseHistory } from "./Components/PurchaseHistory"

export interface PurchaseAppProps {
  me: PurchaseApp_me
}

export const PurchaseApp = (props: PurchaseAppProps) => {
  const { me } = props
  const { user } = useContext(SystemContext)
  // const isAdmin = userIsAdmin(user)
  if (true) {
    return (
      <AppContainer>
        <Title>My Orders | Artsy</Title>
        Purchases
        <PurchaseHistory me={me} />
      </AppContainer>
    )
  } else {
    // not an admin
    return <ErrorPage code={404} />
  }
}

export const PurchaseAppFragmentContainer = createFragmentContainer(
  PurchaseApp,
  {
    me: graphql`
      fragment PurchaseApp_me on Me {
        ...PurchaseHistory_me
      }
    `,
  }
)
