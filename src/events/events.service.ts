import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AddEventDto } from "../dtos/add-event.dto";
import { uuid } from "uuidv4";

const prisma = new PrismaClient()

@Injectable()
export class EventsService {

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

  async addEvent(eventDto: AddEventDto, accessToken: string) {
    await this.isExpired(accessToken);
    try {
      const event = await prisma.events.create({
        data: {
          eventId: uuid(),
          imgUrls: eventDto.imgUrls,
          longDescription: eventDto.longDescription,
          shortDescription: eventDto.shortDescription,
          title: eventDto.title,
          datetime: new Date()
        }
      })
      return { event, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async getEvent(eventId: string) {
    try {
      const event = await prisma.events.findFirst({
        where: {
          eventId,
        },
        select: {
          eventId: true,
          imgUrls: true,
          longDescription: true,
          shortDescription: true,
          title: true,
          datetime: true
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
          title: true,
          datetime: true
        },
        orderBy: {
          datetime: "desc"
        }
      })
      return {events, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }

  async deleteEvent(eventId: string, accessToken: string) {
    await this.isExpired(accessToken);
    try {
      const deletedEvent = await prisma.events.delete({
        where: {
          eventId
        }
      })
      return {deletedEvent, status: "success"}
    } catch (error) {
      return { error, status: "error"}
    }
  }
}
