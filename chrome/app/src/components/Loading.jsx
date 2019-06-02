import React from 'react';

const WithLoading = (props) => {
    return (
        <React.Fragment>
            {
                props.loading
                    ? <div>Loading ...</div>
                    : props.render()
            }
        </React.Fragment>
    );
};

export default WithLoading;