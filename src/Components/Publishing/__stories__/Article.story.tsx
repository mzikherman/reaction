import { storiesOf } from "@storybook/react"
import React from "react"
import styled from 'styled-components'
import _ from "underscore"
import { Article } from "../Article"
import {
  FeatureArticle,
  ImageHeavyStandardArticle,
  MissingVerticalStandardArticle,
  StandardArticle,
  SuperArticle,
} from "../Fixtures/Articles"
import { Display, HeroSections, RelatedCanvas, RelatedPanel } from "../Fixtures/Components"

const story = storiesOf("Publishing/Articles", module)
  .add("Standard", () => {
    return (
      <Article
        article={StandardArticle}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
    )
  })
  .add("Standard without Vertical", () => {
    return (
      <Article
        article={MissingVerticalStandardArticle}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
    )
  })
  .add("Standard with top margin", () => {
    return (
      <Article
        article={ImageHeavyStandardArticle}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
        marginTop="100px"
      />
    )
  })
  .add("Standard truncated", () => {
    return (
      <Article
        article={ImageHeavyStandardArticle}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
        isTruncated
      />
    )
  })

const ads = ["overlay", "image", "video", "slideshow"]
ads.forEach(mediaType => {
  story.add(`Standard with ${mediaType} ad`, () => {
    return (
      <Article
        article={StandardArticle}
        display={Display(mediaType)}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
    )
  })
})

story.add(`Multiple standard articles`, () => {
  const article = {
    ...StandardArticle,
    sections: [
      {
        type: "text",
        body:
        "<p>What would Antoine Court?</p>",
      }
    ]
  }
  return (
    <div>
      <Article
        article={article}
        display={Display('slideshow')}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
      <Break />
      <Article
        article={article}
        display={Display('video')}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
      <Break />
      <Article
        article={article}
        display={Display('image')}
        relatedArticlesForPanel={RelatedPanel}
        relatedArticlesForCanvas={RelatedCanvas}
        emailSignupUrl="#"
      />
    </div>
  )
})

const Break = styled.div`
  border-top: 1px solid #ccc;
  width: 100%;
  margin-top: 80px;
`

story.add("Feature", () => {
  return <Article article={FeatureArticle} relatedArticlesForCanvas={RelatedCanvas} />
})

story.add("Super Article", () => {
  const article = _.extend({}, SuperArticle, { hero_section: HeroSections[2] })
  return <Article article={article} isSuper relatedArticlesForCanvas={RelatedCanvas} />
})

