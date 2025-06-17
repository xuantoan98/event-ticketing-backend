/**
 * @swagger
 * components:
 *  schemas:
 *    Feedback:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: Tiêu đề phản hồi
 *        name:
 *          type: string
 *          description: Tên người phản hồi
 *        email:
 *          type: string
 *          format: email
 *          description: Email người phản hồi
 *        phone:
 *          type: string
 *          description: Số điện thoại người phản hồi
 *        point:
 *          type: number
 *          description: Điểm phản hồi
 *        eventId:
 *          type: string
 *          description: ID sự kiện (ObjectId)
 */

/**
 * @swagger
 * /feedback:
 *  get:
 *    summary: Danh sách phản hồi
 *    tags: [Feedbacks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Số trang
 *      - in: query
 *        name: limit
 *        schema: 
 *          type: integer
 *        description: Số lượng mỗi trang
 *      - in: query
 *        name: sortBy
 *        schema: 
 *          type: string
 *        description: Trường sắp xếp
 *      - in: query
 *        name: sortOrder
 *        schema: 
 *          type: string
 *          enum: [asc, desc]
 *        description: Thứ tự sắp xếp
 *      - in: query
 *        name: q
 *        schema:
 *          type: string
 *        description: Từ khóa tìm kiếm tên
 *    responses:
 *      200:
 *        description: Lấy danh sách phản hồi thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Feedback'
 */

/**
 * @swagger
 * /feedback/{id}:
 *  get:
 *    summary: Lấy thông tin chi tiết phản hồi
 *    tags: [Feedbacks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID phản hồi
 *    responses:
 *      200:
 *        description: Lấy thông tin phản hồi thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Feedback'
 *      400:
 *        description: Phản hồi không tồn tại
 */

/**
 * @swagger
 * /feedback:
 *  post:
 *    summary: Tạo mới phản hồi
 *    tags: [Feedbacks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Feedback'
 *    responses:
 *      200:
 *        description: Tạo mới phản hồi thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Feedback'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /feedback/{id}:
 *  put:
 *    summary: Cập nhật phản hồi
 *    tags: [Feedbacks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID phản hồi
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Feedback'
 *    responses:
 *      200:
 *        description: Cập nhật phản hồi thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Feedback'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /feedback/{id}:
 *  delete:
 *    summary: Xóa phản hồi
 *    tags: [Feedbacks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID phản hồi
 *    responses:
 *      200:
 *        description: Xóa phản hồi thành công
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

import { Router } from "express";
import { feedbackController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createFeedbackValidator, updateFeedbackValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, feedbackController.getFeedbacks);
router.get('/:id', authMiddleware, feedbackController.getFeedback);

router.post('/', authMiddleware, createFeedbackValidator, feedbackController.createFeedback);
router.put('/:id', authMiddleware, updateFeedbackValidator, feedbackController.updateFeedback);
router.delete('/:id', authMiddleware, feedbackController.deleteFeedback);

export default router;
