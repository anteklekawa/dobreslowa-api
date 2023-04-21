import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { AddCommentDto } from "../dtos/add-comment.dto";
import { VerifyPostDto } from "../dtos/verify-post.dto";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create')
  createPost(@Body() postDto: CreatePostDto) {
    return this.postsService.createPost(postDto);
  }

  @Post('/add-like')
  likePost(@Body('postId') postId: string) {
    return this.postsService.likePost(postId);
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
  getPosts(@Param('verifyStatus') verifyStatus: string) {
    return this.postsService.getPosts(verifyStatus);
  }

  @Get('/get-single/:postId')
  getPost(@Param('postId') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Get('/:userId/get')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }

  @Get('/get-comments/:postId')
  getComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId);
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
