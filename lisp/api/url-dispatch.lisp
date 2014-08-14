(in-package :savage-worlds-api)
												
(map-routes
  ("/api/users" :post cl-ddd:users-post 
		:get cl-ddd:users-get )

  ("/api/settings/:id" :put settings-put
			 :delete settings-delete)

  ("/api/settings" :get settings-get
		     :post settings-post)

  ("/api/settingRules" :get setting-rules-get))

(defconstant +Unprocessable-Entity+ 422)

(hunchentoot::def-http-return-code +Unprocessable-Entity+ 422 "Unprocessable Entity")
