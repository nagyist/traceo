import { Injectable, Logger } from "@nestjs/common";
import crypto from "crypto";
import { ISession } from "@traceo/types";
import { Session } from "@db/entities/session.entity";
import { EntityManager } from "typeorm";
import { Request } from "express";
import dateUtils from "@common/helpers/dateUtils";
import dayjs from "dayjs";
import { SESSION_EXPIRY_TIME } from "@common/helpers/constants";

type UserTokenPayload = {
    accountID: string;
    accountName: string;
}
@Injectable()
export class AuthTokenService {
    private logger: Logger;
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(AuthTokenService.name);
    }

    public async createUserToken(payload: UserTokenPayload, req: Request) {
        try {
            const token = this.hashToken();
            const ip = req.ip;
            const expiryAt = dayjs().add(SESSION_EXPIRY_TIME, 'milliseconds').unix();

            const tokenPayload: ISession = {
                accountIP: ip,
                sessionID: token,
                createdAt: dateUtils.toUnix(),
                expiryAt,
                ...payload
            }
            await this.entityManager.getRepository(Session).save(tokenPayload);
            this.logger.log(`[${this.createUserToken.name}] Session succesfully created for user: ${payload.accountName}::${payload.accountID}`)

            return token;
        } catch (err) {
            throw new Error(`[${this.createUserToken.name}] Cannot generate new token for user. Caused by: ${err}`);
        }
    }

    public async revokeUserToken(sessionID: string) {
        try {
            const session = await this.entityManager.getRepository(Session).findOneBy({ sessionID });
            if (!session) {
                this.logger.error(`[${this.createUserToken.name}] Session not found/already revoked.`)
            } else {
                await this.entityManager.getRepository(Session).remove(session);
                this.logger.log(`[${this.revokeUserToken.name}] Session revoked for user: ${session.accountName}::${session.accountName}`)
            }
        } catch (err) {
            this.logger.error(`[${this.revokeUserToken.name}] Caused by: ${err}`);
        }
    }

    public async revokeAllUserTokens(accountID: string, manager: EntityManager = this.entityManager) {
        try {
            await manager.getRepository(Session).delete({ accountID });
            this.logger.log(`[${this.revokeAllUserTokens.name}] Sessions revoked for user: ${accountID}`)
        } catch (err) {
            this.logger.error(`[${this.revokeAllUserTokens.name}] Caused by: ${err}`);
            throw new Error(err);
        }
    }

    private hashToken() {
        return crypto.randomBytes(32).toString("hex");
    }
}