function fetchParentCall(client, parentCallSid){
    return client.calls(parentCallSid)
            .fetch()
}

exports.handler = function(context, event, callback) {
	const client = context.getTwilioClient();
	console.log(JSON.stringify(event))
	
	fetchParentCall(client, event.ParentCallSid)
	    .then(call => {
        	client.sync.services(context.SYNC_SERVICE_SID)
	            .syncMaps('ActiveCall')
	            .syncMapItems('Call')
	            .update({ data: {
	                    ParentCall: {
	                        sid: call.sid,
	                        status: call.status
	                    },
	                    ChildCall: {
	                        sid: event.CallSid,
	                        status: event.CallStatus
	                    }
	                }
	            })
	            .then(result => {
	                callback(null,result)
	            })
	    })
	
	
};