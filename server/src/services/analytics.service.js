const prisma = require("../config/prisma");


const getOverviewService = async (user) => {
    try {
        const totalProjects=await prisma.project.count({
            where:{
                companyId:user.companyId
            }
        });
        const totalEvents=await prisma.event.count({
            where:{
                project:{
                    companyId:user.companyId
                }
            }
        });
        const activeApiKeys=await prisma.apiKey.count({
            where:{
                isActive:true,
                project:{
                    companyId:user.companyId
                }
            }
        })
        return {
            success: true,
            data: {
                totalProjects,
                totalEvents,
                activeApiKeys
            }
        };
    }catch (error) {
        throw error;
    }
}
const getTopEventsService = async (user) => {
    try{
        const topEvents=await prisma.event.groupBy({
            by:['eventName'],
            where:{
                project:{
                    companyId:user.companyId
                }
            },
            _count:{
                eventName:true
            },
            orderBy:{
                _count:{
                    eventName:'desc'
                }
            },
            take:5
        });

        const formattedEvents = topEvents.map((event) => ({
            eventName: event.eventName,
            count: event._count.eventName,
        }));
        return {
            success:true,
            data:formattedEvents
        }
    }catch (error) {
        throw error;
    }
}

module.exports = {
    getOverviewService,
    getTopEventsService
};