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
      return { commentedPostId: data.postId, status: "success" }
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

  async getPost(postId: string) {
    try {
      const post = await prisma.posts.findFirst({
        where: {
          postId,
        }
      })
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
      });

      const comments = await prisma.comments.findMany({
        where: {
          postId
        },
        select: {
          commentId: true
        },
        orderBy: {
          datetime: "desc"
        }
      })

      delete post.author
      delete post.comments

      return { status: "success", post: { ...post, author, comments }}
    } catch (error) {
      return { status: "error", error}
    }
  }

  async getPosts(verifyStatus: string) {
    try {
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
      const posts = await Promise.all(data.map(async (post) => {
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
        });
        const commentsCount = prisma.comments.count({
          where: {
            postId: post.postId
          }
        })
        delete post.author;
        return { ...post, author, commentsCount }
      }));
      return { posts, status: "success" }
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

  async getComments(commentIds: any) {
      const data = commentIds?.commentIds;
      const comments = await Promise.all(data.map(async (commentId) => {
        const comment = await prisma.comments.findFirst({
          where: {
            commentId
          },
          select: {
            commentId: true,
            postId: true,
            author: true,
            datetime: true,
            content: true
          },
          orderBy: {
            datetime: "desc"
          }
        })
        const author = await prisma.users.findFirst({
          where: {
            userId: comment.author
          }
        })

        delete author.password;
        delete author.email;
        delete author.roles;
        delete author.posts;
        delete author.accessToken;

        return { ...comment, author }
      }));
      return { comments, status: "success" }
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
