// backend/src/modules/Section/Section.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "Introduction to Programming"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SectionResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             section:
 *               $ref: '#/components/schemas/Section'
 *
 *     SectionsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             sections:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *
 *     CreateSectionRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - name
 *       properties:
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "Advanced Concepts"
 *
 *     GetSectionsRequest:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 */

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Course section management
 */

/**
 * @swagger
 * /api/v1/sections:
 *   post:
 *     summary: Create a new course section (Teacher/Admin only)
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSectionRequest'
 *     responses:
 *       201:
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized or not course author
 *       403:
 *         description: Forbidden (not teacher/admin)
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/v1/sections:
 *   get:
 *     summary: Get all sections for a course
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetSectionsRequest'
 *     responses:
 *       200:
 *         description: List of sections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionsListResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
