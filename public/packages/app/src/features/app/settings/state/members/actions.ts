import api, { ApiQueryParams } from "../../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import {
  ApplicationMember,
  ApiResponse
} from "@traceo/types";
import { membersLoaded } from "./reducers";

export const loadMembers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    const { data } = await api.get<ApiResponse<ApplicationMember[]>>("/api/member/search", {
      ...query,
      id: application?.id
    });
    dispatch(membersLoaded(data));
  };
};
