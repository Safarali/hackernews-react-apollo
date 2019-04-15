import React from 'react';

const Link = ({ link }) => (
    <>
        <div>
            {link.description} ({link.url})
        </div>
    </>
);


export default Link;