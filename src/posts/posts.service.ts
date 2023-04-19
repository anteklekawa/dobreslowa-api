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
          author: postDto.author,
          datetime: new Date(),
          postId: uuid(),
          likes: 0,
          verifyStatus: "pending"
        }
      })
      const userPosts = await prisma.users.update({
        where: {
          userId: post.author
        },
        data: {
          posts: {
            push: post.postId
          }
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
          postId: commentDto.postId,
          datetime: new Date(),
          commentId: uuid()
        }
      })
      const postComments = await prisma.posts.update({
        where: {
          postId: commentDto.postId
        },
        data: {
          comments: {
            push: data.commentId
          }
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
      const posts = [];
      const data = await prisma.posts.findMany({
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
        },
        orderBy: {
          datetime: 'desc'
        }
      })
      data.map(async post => {
        const author = await prisma.users.findFirst({
          where: {
            userId: post.author
          },
          select: {
            userId: true,
            username: true,
            name: true,
            surname: true
          }
        })
        posts.push({post, author});
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

  async deletePost(postId: string) {
    try {
      const deletedPost = await prisma.posts.delete({
        where: {
          postId
        }
      })
      return {deletedPost, status: "success"}
    } catch (error) {
      return {error, status: "error"}
    }
  }

  async deleteComment(commentId: string) {
    try {
      const deletedComment = await prisma.comments.delete({
        where: {
          commentId
        }
      })
      return {deletedComment, status: "success"}
    } catch (error) {
      return {error, status: "error"}
    }
  }

  async deleteLike(postId: string) {
    try {
      const unlikedPost = await prisma.posts.update({
        where: {
          postId
        },
        data: {
          likes: {
            decrement: 1
          }
        }
      })
      return {unlikedPost, status: "success"}
    } catch (error) {
      return {error, status: "error"}
    }
  }

}
