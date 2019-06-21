import React from 'react';

const WithLoading = (props) => {
    return props.loading
        ? <div>Loading ...</div>
        : props.render()
};

export default WithLoading;
