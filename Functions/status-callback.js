//Fetch parent call leg
function fetchParentCall(client, parentCallSid) {
	return client.calls(parentCallSid)
			.fetch()
}

//Fetch items from sync map
function fetchSyncItem(client, context) {
	return client.sync.services(context.SYNC_SERVICE_SID)
			.syncMaps('ActiveCall')
			.syncMapItems
			.list()
}

exports.handler = function (context, event, callback) {
	const client = context.getTwilioClient();

	fetchParentCall(client, event.ParentCallSid)
			.then(call => {
					console.log("hello")
					fetchSyncItem(client, context)
							.then(result => {
									/**
									 * If the result isn't equal to 0 update the sync map, else create the item 
									 */
									if (result.length !== 0) {
											client.sync.services(context.SYNC_SERVICE_SID)
													.syncMaps('ActiveCall')
													.syncMapItems('Call')
													.update({
															data: {
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
															callback(null, result)
													})
													.catch(err => {
															console.log(err)
															callback(null, err)
													})
									} else {
											client.sync.services(context.SYNC_SERVICE_SID)
													.syncMaps('ActiveCall')
													.syncMapItems
													.create({
															key: 'Call',
															data: {
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
															console.log(result)
															callback(null, result)
													})
													.catch(err => {
															console.log(err)
															callback(null, err)
													});
									}
							});
			})
			.catch(err => {
					console.log(err)
					callback(null, err)
			})
};
