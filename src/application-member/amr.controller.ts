import { Body, Controller, Delete, Get, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountMemberRelationship } from 'src/db/entities/account-member-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AddAccountToApplicationModel, AwrModel, ApplicationDtoQuery } from './amr.model';
import { AmrService } from './amr.service';

@ApiTags('application-member-relationship')
@Controller('amr')
export class AmrController {
    constructor(
        private readonly awrService: AmrService,
        private readonly awrQueryService: AmrQueryService
    ) {}

    @Get('/account')
    @AuthRequired()
    async getAccountById(
        @Query('id') id: string
    ): Promise<Account> {
        return await this.awrQueryService.getAccount(id);
    }

    @Get('/members')
    @AuthRequired()
    public async getApplicationMembers(
        @Query("id") id: number,
        @Query() query: BaseDtoQuery
    ): Promise<AccountMemberRelationship[]> {
        return await this.awrQueryService.getApplicationMembers(id, query);
    }

    @Get('/applications')
    @AuthRequired()
    public async getAccountApplications(
        @Query() pageOptionsDto: ApplicationDtoQuery,
        @AuthAccount() account: RequestUser
    ): Promise<AccountMemberRelationship[]> {
        return await this.awrQueryService.getApplicationsForAccount(account?.id, pageOptionsDto);
    }

    @Post('/application/add')
    @AuthRequired()
    public async addAccountToApplication(
        @Body() body: AddAccountToApplicationModel
    ): Promise<void> {
        const { email, appId } = body;
        return await this.awrService.addAccountToApplication(email, appId);
    }

    @Get('/application/assign')
    public async assignAccountToApplication(
        @Query("appId") appId: number,
        @Query("aid") accountId: string
    ): Promise<void> {
        return await this.awrService.assignAccountToApplication(accountId, appId);
    }

    @Patch('/application/member')
    @AuthRequired()
    public async updateApplicationAccount(
        @Body() body: AwrModel
    ): Promise<void> {
        return await this.awrService.updateApplicationAccount(body);
    }

    @Delete('/application/member')
    @AuthRequired()
    public async removeAccountFromApplication(
        @Query("id", new ParseUUIDPipe()) id: string,
    ): Promise<void> {
        return await this.awrService.removeAccountFromApplication(id);
    }

    @Delete('/application/leave')
    @AuthRequired()
    public async leaveApplication(
        @Query("aid", new ParseUUIDPipe()) aid: string,
        @Query("appId") appId: number,
    ): Promise<void> {
        return await this.awrService.leaveApplication(aid, appId);
    }
}