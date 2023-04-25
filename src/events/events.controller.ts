import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from "@nestjs/common";
import { EventsService } from "./events.service";
import { AddEventDto } from "../dtos/add-event.dto";

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/add')
  addEvent(@Body() eventDto: AddEventDto, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.eventsService.addEvent(eventDto, accessToken);
  }

  @Get('/get-single/:eventId')
  getEvent(@Param('eventId') eventId: string) {
    return this.eventsService.getEvent(eventId);
  }

  @Get('/get')
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Post('/delete/:eventId')
  deleteEvent(@Param('eventId') eventId: string, @Headers('Authorization') headers) {
    if (!headers) throw new UnauthorizedException('There is no access token!')
    const accessToken = headers.slice(7);
    return this.eventsService.deleteEvent(eventId, accessToken);
  }
}
