import React from 'react';
import Link from './Link';


const FEED_QUERY = gql `
    {
        feed {
            links {
                id
                createdAt
                url
                description
            }
        }
    }
`;
const LinkList = () => {
    return (

        <Query query={FEED_QUERY}>
            {
                linksToRender.map(link => 
                    <Link key={link.id} link={link}/>
                )
            }
        </Query>
        
    );
};

export default LinkList;