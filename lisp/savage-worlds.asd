(in-package :cl)
(defpackage savage-worlds-asd (:use :cl :asdf))
(in-package :savage-worlds-asd)

(asdf:defsystem #:savage-worlds
    :description "An online virtual table top environment custom to Savage Worlds"
    :version "1.0.0"
    :depends-on (:fiveam 
		 :hunchentoot 
		 :cl-json
		 :cl-store
		 :uuid
		 :ht-routes
		 :sb-daemon
		 :closer-mop)
    :components ((:static-file "README.md")

		 (:module "cl-ddd"
			  :components((:file "package")
				      (:file "authentication-services" :depends-on ("package" 
										    "authentication-entities"
										    "entity"))
				      (:file "authentication-json-endpoint" 
					     :depends-on ( "package" 
							   "authentication-services"))
				      (:file "authentication-entities" :depends-on ("package" 
										    "entity"))
				      (:file "entity" :depends-on ("package"))))

		 (:module "api"
			  :depends-on ( :main :cl-ddd)
			  :components((:file "package")
				      (:file "configuration" :depends-on ("package"))
				      (:file "cl-json-customizations" :depends-on ("package"
										   "configuration"))
				      (:file "setting-end-points" :depends-on("package" 
									      "configuration"))
				      (:file "setting-rules-end-points" :depends-on("package" 
										    "configuration"))
				      (:file "skill-description-end-points" :depends-on(
											"package" 
											"configuration"))
				      (:file "hindrance-end-points" :depends-on( "package"
										 "configuration"))
				      (:file "edge-end-points" :depends-on( "package"
										 "configuration"))
				      (:file "gear-description-end-points" :depends-on( "package"
											"configuration"))
				      (:file "url-dispatch" :depends-on ("package"
									 "configuration"
									 "setting-end-points"))
				      (:file "bootstrap" :depends-on ("package" 
								      "configuration"))))
		 (:module "main"
			  :depends-on (:cl-ddd)
			  :components ((:file "package")
				       (:file "utils" 
					      :depends-on ("package"))
				       (:file "traits"
					      :depends-on ("package"))
				       (:file "dice" :depends-on ("package"))
				       (:file "races" :depends-on ("package"))
				       (:file "gear" :depends-on ("package" "utils"))
				       (:file "skills" 
					      :depends-on ("package" "traits" "dice"))
				       (:file "edges"
					      :depends-on( "package" "traits"))
				       (:file "hindrances"
					      :depends-on( "package" "traits"))
				       (:file "setting-rules" :depends-on( "package"))
				       (:file "base-record" :depends-on( "package" "gear" "skills"))
				       (:file "beasts" :depends-on("package" "base-record"))
				       (:file "setting" :depends-on ("package"
								     "setting-rules"
								     "hindrances"
								     "edges"
								     "skills"
								     "gear"
								     "races"
								     "traits"
								     "beasts"))
				       (:file "character-record" 
					      :depends-on ("package" 
							   "utils"
							   "base-record"
							   "traits" 
							   "dice" 
							   "races" 
							   "skills"
							   "gear"
							   "edges"
							   "traits"
							   "setting"))
				       (:file "character-creation-state" :depends-on("package" "character-record"))
				       (:file "constants" :depends-on ("package"
								       "setting-rules"
								       "edges"
								       "hindrances"))
				       (:file "repositories" :depends-on("package" "setting"))))
		 (:module "unit-tests"
			  :depends-on (:main )
			  :components ((:file "package")
				       (:file "test-character-record" :depends-on("package"))))))
		 

