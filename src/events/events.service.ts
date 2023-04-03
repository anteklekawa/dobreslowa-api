import { Injectable } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import { AddEventDto } from "../dtos/add-event.dto";
import { uuid } from "uuidv4";

const prisma = new PrismaClient()

@Injectable()
export class EventsService {
  async addEvent(eventDto: AddEventDto) {
    try {
      const event = await prisma.events.create({
        data: {
          eventId: uuid(),
          imgUrls: eventDto.imgUrls,
          longDescription: eventDto.longDescription,
          shortDescription: eventDto.shortDescription,
          title: eventDto.title
        }
      })
      return { event, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async getEvent(eventId: string) {
    try {
      const event = await prisma.events.findUnique({
        where: {
          eventId,
        },
        select: {
          eventId: true,
          imgUrls: true,
          longDescription: true,
          shortDescription: true,
          title: true
        }
      })
      return { event, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }

  }

  async getEvents() {
    try {
      const events = await prisma.events.findMany({
        select: {
          eventId: true,
          imgUrls: true,
          longDescription: true,
          shortDescription: true,
          title: true
        }
      })
      return {events, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }

  }
}
