import { Body, Controller, Get, Header, Headers, Param, Post, Req, UnauthorizedException } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { AddCommentDto } from "../dtos/add-comment.dto";
import { VerifyPostDto } from "../dtos/verify-post.dto";
import { Request } from "express";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create')
  createPost(@Body() postDto: CreatePostDto) {
    return this.postsService.createPost(postDto);
  }

  @Post('/add-like')
  likePost(@Body('postId') postId: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.likePost(postId, accessToken);
  }

  @Post('/add-comment')
  addComment(@Body() commentDto: AddCommentDto) {
    return this.postsService.addComment(commentDto);
  }

  @Post('/verify')
  verifyPost(@Body() verifyPostDto: VerifyPostDto) {
    return this.postsService.verifyPost(verifyPostDto);
  }

  @Get('/get/:verifyStatus')
  getPosts(@Param('verifyStatus') verifyStatus: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.postsService.getPosts(verifyStatus, accessToken);
  }

  @Get('/get-single/:postId')
  getPost(@Param('postId') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Get('/:userId/get')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }

  @Post('/get-comments')
  getComments(@Body() commentIds: string[]) {
    return this.postsService.getComments(commentIds);
  }

  @Post('/delete/:postId')
  deletePost(@Param('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }

  @Post('/delete/comment/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.postsService.deleteComment(commentId);
  }

  @Post('/delete/like/:postId')
  deleteLike(@Param('postId') postId: string) {
    return this.postsService.deleteLike(postId);
  }

}
