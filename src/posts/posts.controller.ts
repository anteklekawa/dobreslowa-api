import { Body, Controller, Get, Header, Headers, Param, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { AddCommentDto } from "../dtos/add-comment.dto";
import { VerifyPostDto } from "../dtos/verify-post.dto";
import { Request } from "express";
import { VerifyCommentDto } from "../dtos/verify-comment.dto";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create')
  createPost(@Body() postDto: CreatePostDto, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.createPost(postDto, accessToken);
  }

  @Post('/add-like')
  likePost(@Body('postId') postId: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.likePost(postId, accessToken);
  }

  @Post('/add-comment')
  addComment(@Body() commentDto: AddCommentDto, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.addComment(commentDto, accessToken);
  }

  @Post('/verify')
  verifyPost(@Body() verifyPostDto: VerifyPostDto, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.verifyPost(verifyPostDto, accessToken);
  }

  @Post('/verify-comment')
  verifyComment(@Body() verifyCommentDto: VerifyCommentDto, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.verifyComment(verifyCommentDto, accessToken);
  }

  @Get('/get/:verifyStatus')
  getPosts(@Param('verifyStatus') verifyStatus: string, @Headers('Authorization') headers, @Query('sort') sort: string) {
    let accessToken = "";
    if (headers)
    {
      accessToken = headers.slice(7);
    }
    return this.postsService.getPosts(verifyStatus, accessToken, sort);
  }

  @Get('/get-single/:postId')
  getPost(@Param('postId') postId: string, @Headers('Authorization') headers) {
    let accessToken = ""
    if (headers)
    {
      accessToken = headers.slice(7);
    }
    return this.postsService.getPost(postId, accessToken);
  }

  @Get('/:userId/get')
  getUserPosts(@Param('userId') userId: string, @Headers('Authorization') headers) {
    let accessToken = ""
    if (headers)
    {
      accessToken = headers.slice(7);
    }
    return this.postsService.getUserPosts(userId, accessToken);
  }

  @Get('/get-comments/:verifyStatus')
  getComments(@Param('verifyStatus') verifyStatus: string, @Headers('Authorization') headers, @Query('sort') sort: string, @Body() commentIds: string[]) {
    let accessToken = "";
    if (headers)
    {
      accessToken = headers.slice(7);
    }
    return this.postsService.getComments(verifyStatus, accessToken, commentIds);
  }

  @Post('/delete/:postId')
  deletePost(@Param('postId') postId: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.deletePost(postId, accessToken);
  }

  @Post('/delete/comment/:commentId')
  deleteComment(@Param('commentId') commentId: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.deleteComment(commentId, accessToken);
  }
}
