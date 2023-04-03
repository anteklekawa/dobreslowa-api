import { Injectable } from '@nestjs/common';
import { CreatePostDto } from "../dtos/create-post.dto";
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4';
import { AddCommentDto } from "../dtos/add-comment.dto";
import { VerifyPostDto } from "../dtos/verify-post.dto";

const prisma = new PrismaClient()

@Injectable()
export class PostsService {
  async createPost(postDto: CreatePostDto) {
    try {
      const post = await prisma.posts.create({
        data: {
          content: postDto.content,
          imgUrl: postDto.imgUrl,
          datetime: postDto.datetime,
          author: postDto.author,
          postId: uuid(),
          isApproved: false,
          likes: 0,
          verifyStatus: "pending"
        }
      })
      return { postId: post.postId, status: "success" }
    }
    catch (error) {
      return { error, status: "error"}
    }
  }

  async likePost(postId: string) {
    try {
      const likedPost = await prisma.posts.update({
        where: {
          postId: postId
        },
        data: {
          likes: {
            increment: 1,
          }
        }
      })
      return { postId: likedPost.postId, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async addComment(commentDto: AddCommentDto) {
    try {
      const data = await prisma.comments.create({
        data: {
          content: commentDto.content,
          author: commentDto.author,
          datetime: commentDto.datetime,
          postId: commentDto.postId,
          commentId: uuid()
        }
      })
      return { likedPostId: data.postId, status: "success" }
    } catch (error) {
      return { error, status: "success"}
    }
  }

  async verifyPost(verifyPostDto: VerifyPostDto) {
    try {
      const post = await prisma.posts.update({
        where: {
          postId: verifyPostDto.postId
        },
        data: {
          verifyStatus: verifyPostDto.verifyStatus
        }
      })
      return { verifiedPostId: post.postId, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async getPosts(verifyStatus: string) {
    try {
      const posts = await prisma.posts.findMany({
        where: {
          verifyStatus,
        },
        select: {
          content: true,
          postId: true,
          likes: true,
          imgUrl: true,
          comments: true,
          verifyStatus: true,
          author: true,
          datetime: true
        }
      })
      return { posts, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }

  }

  async getUserPosts(userId: string) {
    try {
      const userPosts = await prisma.posts.findMany({
        where: {
          author: userId
        },
        select: {
          content: true,
          postId: true,
          likes: true,
          imgUrl: true,
          comments: true,
          verifyStatus: true,
          author: true,
          datetime: true
        }
      })
      return { userPosts, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }

  }

  async getComments(postId: string) {
    try {
      const comments = await prisma.comments.findMany({
        where: {
          postId: postId
        },
        select: {
          commentId: true,
          author: true,
          datetime: true,
          content: true
        }
      })
      return { comments, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

}
