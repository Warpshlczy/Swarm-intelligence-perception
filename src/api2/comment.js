import axios from 'axios'
const commentApi = {
    //查询任务下的所有评论
    getAllComments(taskID) {
        return axios.get(`/comments/search/${taskID}`)
    },
    //新增一条评论
    addNewComment(task_id, content) {
        return axios.post('/comments/add', { task_id: task_id, content: content })
    },
    //删除一条评论
    deleteComment(comment_id) {
        return axios.put(`/comments/delete/${comment_id}`)
    },
    //查询某个评论下的所有回复
    getAllResponses(comment_id) {
        return axios.get(`/response/search/${comment_id}`)
    },
    //新增一条某个评论下的回复
    addNewResponse(content, comment_id) {
        return axios.post('/response/add', { content: content, comment_id: comment_id })
    },
    //删除一条某个评论下的回复
    deleteResponse(response_id) {
        return axios.put(`/response/delete/${response_id}`)
    },
    //查询一条回复下的所有回复
    getAllRTR(comment_id, response_id) {
        return axios.get('/response/from/response', { comment_id: comment_id, response_id: response_id })
    },
    //新增一条对一条回复的回复
    addNewRTR(content, response_id) {
        return axios.post('/response/from/response/add', { content: content, response_id: response_id })
    },
    //删除一条对一条回复的回复
    deleteRTR(response_id) {
        returnaxios.put(`/response/from/response/delete/${response_id}`)
    }

}
export default commentApi