(in-package :savage-worlds-api)

(defun settings-get ()
  (hunchentoot::log-message* :debug "settings-get")
  (setf (hunchentoot:content-type*) "application/json") 
  (let ((setting-list (cl-ddd::list-data savage-worlds::*setting-repository*)))
    (if setting-list
	(format nil "{\"settings\":~a}" (encode-json-to-string 
			  (cl-ddd::list-data  savage-worlds::*setting-repository*)))
	(format nil "{\"settings\":[]}"))))

(defun settings-post ()
  (setf (hunchentoot:content-type*) "application/json") 
  (let* ((input-string (hunchentoot::raw-post-data :force-text t))
	 (input-json (rest (first (decode-json-from-string input-string))))
	 (name (string-trim " " (rest (assoc :name input-json))))
	 (user-id (uuid:make-uuid-from-string (string-trim " " (rest (assoc :user-id input-json)))))
	 (new-setting (make-instance savage-worlds::'setting :name name :user-id user-id)))
    (hunchentoot::log-message* :debug "setting post user-id ~a; name ~a" user-id name)
    (cl-ddd::add savage-worlds::*setting-repository* new-setting)
    (format nil "{\"settings\":[~a]}" (encode-json-to-string new-setting))))

(defun settings-put ()
  (setf (hunchentoot:content-type*) "application/json") 
  (let* ((input-string (hunchentoot::raw-post-data :force-text t))
	 (input-json (rest (first (decode-json-from-string input-string))))
	 (id (uuid:make-uuid-from-string (getf *route-params* :id)))
	 (name (string-trim " " (rest (assoc :name input-json))))
	 (setting-rules (map 'list #'parse-integer (rest (assoc :setting-rules input-json)))))
    (hunchentoot::log-message* :debug "setting put id ~a; name ~a; setting-rules ~a" id name setting-rules)
    (format nil "{\"setting\":~a}" (encode-json-to-string 
				       (savage-worlds::update 
					savage-worlds::*setting-repository* 
					id 
					:name name
					:setting-rule-ids setting-rules)))))

(defun settings-delete ()
  (setf (hunchentoot:content-type*) "application/json") 
  (let* ((id (uuid:make-uuid-from-string (getf *route-params* :id))))
    (hunchentoot::log-message* :debug "settings delete id ~a" id)
    (savage-worlds::delete-setting savage-worlds::*setting-repository* id))
  (format nil ""))

