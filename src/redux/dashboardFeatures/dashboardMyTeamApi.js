import { baseApi } from "../api/baseApi";

const dashboardMyTeamApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postDashboardMyTeamApi: builder.mutation({
            query: (createTeam) => ({
                url: `/create-team`,
                method:"POST",
                body:createTeam,
            }),
            invalidatesTags: ['team'],
        }),
        getDashboardMyTeamApi: builder.query({
            query: () => ({
                url: `/get-team?search`,
                method:"GET"
            }),
            providesTags: ['team'],
        }),
        deleteDashboardMyTeamApi: builder.mutation({
            query: (id) => ({
                url: `/delete-team?team_id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['team'],
        }),
        updateDashboardMyTeamApi: builder.mutation({
            query: ({team_id,updateInfo}) => ({
                url: `/update-team?team_id=${team_id}`,
                method:"POST",
                body:updateInfo,
            }),
            invalidatesTags: ['team'],
        }),
        singleGetDashboardMyTeamApi: builder.query({
            query: (id) => ({
                url: `/team?team_id=${id}`,
                method:"GET"
            }),
            providesTags: ['team'],
        }),
    })
})


export const {usePostDashboardMyTeamApiMutation,useGetDashboardMyTeamApiQuery,useDeleteDashboardMyTeamApiMutation,useUpdateDashboardMyTeamApiMutation,useSingleGetDashboardMyTeamApiQuery} = dashboardMyTeamApi;