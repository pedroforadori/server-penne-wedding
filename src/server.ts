import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'


const prisma = new PrismaClient({
    log: ['query']
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.get('/guest', async () => {
        const guest = await prisma.guest.findMany()
        return { guest }
    })

    fastify.post('/guest', async (request, reply) => {
        const createPoolBody = z.object({
            phone: z.string(),
            name: z.string()
        })

        const { phone, name } = createPoolBody.parse(request.body)

        const guest = await prisma.guest.create({
            data: {
                phone,
                name
            }
        })

        return reply.status(201).send({ guest })
    })
    
    await fastify.listen({ port: 3333 })
}

bootstrap()