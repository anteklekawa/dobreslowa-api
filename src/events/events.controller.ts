import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EventsService } from "./events.service";
import { AddEventDto } from "../dtos/add-event.dto";

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/add')
  addEvent(@Body() eventDto: AddEventDto) {
    return this.eventsService.addEvent(eventDto);
  }

  @Get('/:eventId/get')
  getEvent(@Param('eventId') eventId: string) {
    return this.eventsService.getEvent(eventId);
  }

  @Get('/get')
  getEvents() {
    return this.eventsService.getEvents();
  }
}
