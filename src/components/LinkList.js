import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';
import { LINKS_PER_PAGE } from '../constants';


const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink {
            id
            url
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
`;

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const LinkList = (props) => {

    const getQueryVariables = () => {
        const isNewPage = this.props.location.pathname.includes('new');
        const page = parseInt(this.props.match.params.page, 10);

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = isNewPage ? 'createdAt_DESC' : null;
        return { first, skip, orderBy };
    };



    const updateCacheAfterVote = (store, createdVote, linkId) => {
        const isNewPage = props.location.pathname.includes('new');
        const page = parseInt(this.props.match.params.page, 10);

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = isNewPage ? 'createdAt_DESC' : null;
        const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
        });

        const votedLink = data.feed.links.find(link => link.id === linkId);
        votedLink.votes = createdVote.link.votes;
        store.writeQuery({ query: FEED_QUERY, data })
    };

    const subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const { newLink } = subscriptionData.data;
                const exists = prev.feed.links.find(({ id }) => id === newLink.id);
                if (exists) return prev;

                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
                        __typename: prev.feed.__typename
                    }
                })
            }
        })
    };

    const getLinksToRender = data => {
        const isNewPage = props.location.pathname.includes('new');
        if (isNewPage) {
            return data.feed.links;
        }

        const rankedLinks =  [ ...data.feed.links ];
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
        return rankedLinks;
    }

    const previousPage = () => {
        const page = parseInt(props.match.params.page, 10);
        if (page > 1) {
            const previousPage = page - 1;
            props.history.push(`/new/${previousPage}`);
        }
    }

    const nextPage = data => {
        const page = parseInt(props.match.params.page, 10);
        if (page <= data.feed.count / LINKS_PER_PAGE) {
            const nextPage = page + 1;
            props.history.push(`/new/${nextPage}`)
        }
    };

    const subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    };

    return (
        <Query query={FEED_QUERY} variables={getQueryVariables}>
            {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <div>Fetching</div>
                if (error) return <div>Error</div>

                subscribeToNewLinks(subscribeToMore);
                subscribeToNewVotes(subscribeToMore);

                const linksToRender = getLinksToRender(data);
                const isNewPage = props.location.pathname.includes('new');
                const pageIndex = props.match.params.page
                    ? (props.match.params.page - 1) * LINKS_PER_PAGE
                    : 0;
                
                

                return (
                    <>
                        {linksToRender.map((link, index) => 
                            <Link 
                                key={link.id} 
                                link={link}
                                index={index + pageIndex}
                                updateStoreAfterVote={updateCacheAfterVote}
                            />
                        )}
                        {isNewPage && (
                            <div className="flex ml4 mv3 gray">
                                <div className="pointer mr2" onClick={previousPage}>
                                    Previous
                                </div>
                                <div className="pointer" onClick={() => nextPage(data)}>
                                    Next
                                </div>
                            </div>
                        )}
                    </>
                );
            }}
        </Query>   
    );
};

export default LinkList;