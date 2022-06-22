class ApiFeatures {
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword 
        ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            },
            }
        :   {};

        this.query = this.query.find({ ...keyword })
        
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryStr };

        const removeFields = [ "keyword", "page", "limit"];

        removeFields.forEach((key) => delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)
        

        this.query = this.query.find(JSON.parse(queryStr));
      
        return this;
        
    }

    pagination(perPageProducts){
        const currentPage = Number(this.queryStr.page) || 1;

        let skipCount = perPageProducts * (currentPage - 1)

        const skip = this.query.limit(perPageProducts).skip(skipCount);

        return this;
    }

}

module.exports = ApiFeatures