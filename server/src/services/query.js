const getPagination = (query) => {
    const page = Math.abs(query.page) || 1;
    // We are putitng 0 because in mongoose 0 means to get all data
    const limit = Math.abs(query.limit) || 0;
    const skip = (page - 1) * limit

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}