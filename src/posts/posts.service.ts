import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreatePostDto } from "../dtos/create-post.dto";
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4';
import { AddCommentDto } from "../dtos/add-comment.dto";
import { VerifyPostDto } from "../dtos/verify-post.dto";
import { VerifyCommentDto } from "../dtos/verify-comment.dto";

const prisma = new PrismaClient()

@Injectable()
export class PostsService {

  async checkIfAdmin(userId: string) {
    const userRoles = await prisma.users.findUnique({
      where: {
        userId
      },
      select: {
        roles: true
      }
    })

    const isUser = userRoles.roles.find((role) => role === 4832);

    return isUser > 0;
  }

  async checkIfVerifier(userId: string) {
    const userRoles = await prisma.users.findUnique({
      where: {
        userId
      },
      select: {
        roles: true
      }
    })

    const isUser = userRoles.roles.find((role) => role === 3210);

    return isUser > 0;
  }

  async checkIfDev(userId: string) {
    const userRoles = await prisma.users.findUnique({
      where: {
        userId
      },
      select: {
        roles: true
      }
    })

    const isUser = userRoles.roles.find((role) => role === 2137);

    return isUser > 0;
  }

  async isExpired(accessToken: string) {
    const data = await prisma.users.findFirst({
      where: {
        accessToken
      },
      select: {
        isTokenExpired: true
      }
    })

    if (data.isTokenExpired == true) {
      throw new ForbiddenException('Access Token is expired!');
    }
  }

  async createPost(postDto: CreatePostDto, accessToken: string) {
    await this.isExpired(accessToken);
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

  async likePost(postId: string, accessToken: string) {
    await this.isExpired(accessToken);
    try {
      const user = await prisma.users.findFirst({
        where: {
          accessToken,
        },
        select: {
          userId: true
        }
      })

      const isLiked = await prisma.likedPosts.findMany({
        where: {
          userId: user.userId,
          postId,
        }
      })

      if (isLiked.length > 0)
      {
        await prisma.posts.update({
          where: {
            postId
          },
          data: {
            likes: {
              decrement: 1
            }
          }
        });

        await prisma.likedPosts.deleteMany({
          where: {
            userId: user.userId,
            postId
          }
        })

        return { status: "success", liked: false}
      }

      else
      {
        await prisma.likedPosts.create({
          data: {
            userId: user.userId,
            postId
          }
        })

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
        return { status: "success", liked: true}
      }

    } catch (error) {
      return { error, status: "error"}
    }
  }

  async addComment(commentDto: AddCommentDto, accessToken: string) {
    await this.isExpired(accessToken)
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

  async verifyPost(verifyPostDto: VerifyPostDto, accessToken: string) {
    const user = await prisma.users.findFirst({
      where: {
        accessToken
      },
      select: {
        userId: true
      }
    })

    if (await this.checkIfDev(user.userId) == true || await this.checkIfAdmin(user.userId) == true || await this.checkIfVerifier(user.userId) == true) {
      await this.isExpired(accessToken);
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
    } else {
      throw new UnauthorizedException('Your account does not have required roles to execute this action')
    }
  }

  async verifyComment(verifyCommentDto: VerifyCommentDto, accessToken: string) {
    const user = await prisma.users.findFirst({
      where: {
        accessToken
      },
      select: {
        userId: true
      }
    })

    if (await this.checkIfDev(user.userId) == true || await this.checkIfAdmin(user.userId) == true || await this.checkIfVerifier(user.userId) == true) {
      await this.isExpired(accessToken);
      try {
        const comment = await prisma.comments.update({
          where: {
            commentId: verifyCommentDto.commentId
          },
          data: {
            verifyStatus: verifyCommentDto.verifyStatus
          }
        })
        return { verifiedPostId: comment.commentId, status: "success"}
      } catch (error) {
        return { error, status: "error"}
      }
    } else {
      throw new UnauthorizedException('Your account does not have required roles to execute this action')
    }
  }

  async getPost(postId: string, accessToken: string) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          accessToken
        },
        select: {
          userId: true
        }
      })

      const userId = user.userId;

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

      const commentsDb = await prisma.comments.findMany({
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

      const likeData = await prisma.likedPosts.findMany({
        where: {
          userId,
          postId
        }
      })

      let liked = false;

      if (likeData.length > 0)
      {
        liked = true
      }

      const comments = [];
      await commentsDb.forEach( (comment) => {
        comments.push(comment.commentId);
      })

      delete post.author
      delete post.comments

      return { status: "success", post: { ...post, author, comments, liked }}
    } catch (error) {
      return { status: "error", error}
    }
  }

  async getPosts(verifyStatus: string, accessToken: string, sort: string) {
      const user = await prisma.users.findFirst({
        where: {
          accessToken
        }
      })
      const userId = user.userId

      if (verifyStatus == 'pending' || verifyStatus == 'declined') {
        let havePermission = false;
        if (await this.checkIfDev(userId) == true || await this.checkIfVerifier(userId) == true) { havePermission = true }
        if (havePermission == false) {
          throw new UnauthorizedException('Your account does not have required roles to execute this action')
        }
      }

        const likedPostsData = await prisma.likedPosts.findMany({
          where: {
            userId
          }
        })

        const likedPosts = likedPostsData.map((post) => {
          return post.postId
        })

        let data = [];

        if (sort == "likes")
        {
          data = await prisma.posts.findMany({
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
              likes: 'desc'
            }
          })
        } else {
          data = await prisma.posts.findMany({
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
        }


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

          const commentsCount = await prisma.comments.count({
            where: {
              postId: post.postId,
              verifyStatus: "verified"
            }
          })

          let liked = false;

          likedPosts.forEach((postId) => {
            if (postId == post.postId)
            {
              liked = true
            }
          })

          delete post.author;
          return { ...post, author, commentsCount, liked }
        }));
        return { posts, status: "success" }
  }

  async getUserPosts(userId: string, accessToken) {
    try {

      const tokenUser = await prisma.users.findFirst({
        where: {
          accessToken
        },
        select:  {
          userId: true
        }
      })

      const author = await prisma.users.findFirst({
        where: {
          userId
        },
        select: {
          userId: true,
          username: true,
          name: true,
          surname: true
        }
      })

      const user = {username: author.username, name: author.name, surname: author.surname}

      let userPosts = [];

      if (author.userId == tokenUser.userId)
      {
        userPosts = await prisma.posts.findMany({
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
          },
          orderBy: {
            datetime: "desc"
          }
        })
      }

      else {
        userPosts = await prisma.posts.findMany({
          where: {
            author: userId,
            verifyStatus: "verified"
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
            datetime: "desc"
          }
        })
      }

      const posts = await Promise.all(userPosts.map(async (post) => {
        delete post.author;

        const isLiked = await prisma.likedPosts.findMany({
          where: {
            userId: tokenUser.userId,
            postId: post.postId
          },
        })

        let liked = false;

        if (isLiked.length > 0)
        {
          liked = true
        }

        return { ...post, author, liked}
      }));

      return { posts, status: "success", user}
    } catch (error) {
      return { error, status: "error"}
    }

  }

  async getComments(verifyStatus: string, accessToken: string, commentIds: any) {
    const user = await prisma.users.findFirst({
      where: {
        accessToken
      }
    })
    const userId = user.userId

    if (verifyStatus == 'pending' || verifyStatus == 'declined') {
      let havePermission = false;
      if (await this.checkIfDev(userId) == true || await this.checkIfVerifier(userId) == true) { havePermission = true }
      if (havePermission == false) {
        throw new UnauthorizedException('Your account does not have required roles to execute this action')
      }
    }

    const data = commentIds?.commentIds;
    const comments = await Promise.all(data.map(async (commentId) => {
      const comment = await prisma.comments.findFirst({
        where: {
          commentId,
          verifyStatus
        },
        select: {
          commentId: true,
          postId: true,
          author: true,
          datetime: true,
          content: true,
          verifyStatus: true
        },
        orderBy: {
          datetime: "desc"
        }
      })
      if (!comment) {return null}
        const author = await prisma.users.findFirst({
          where: {
            userId: comment.author
          },
          select: {
            userId: true,
            username: true,
            name: true,
            surname: true
          }
        })



      return { ...comment, author}
    }));
    return { comments, status: "success" }
  }

  async deletePost(postId: string, accessToken: string) {
    await this.isExpired(accessToken);
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

  async deleteComment(commentId: string, accessToken: string) {
    await this.isExpired(accessToken)
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
}
