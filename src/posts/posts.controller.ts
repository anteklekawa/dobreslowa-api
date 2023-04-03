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

  @Get('/:userId/get')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }

  @Get('/get-comments/:postId')
  getComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId);
  }

}
