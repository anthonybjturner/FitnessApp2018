angular.module("app")
    .controller('exercisesCtrl', function($http, $scope, $rootScope, panel, editpanel, alert, calendarService) {

        $rootScope.title = "Exercises";
       
         var self = this;
         self.header = "Exercises"
         self.pageDescription  = "Keep track of your exercises";
         self.rows = [];
         self.isViewing = false;
         self.bgimage = "/images/exercise.jpg";
         self.createItemButtonText = "New Exercise";
         self.deleteItemsButtonText = "Delete all";
         self.totalMinutes = 0, self.totalCalsBurned = 0;

           $scope.updateCalendar = function(){
    
                   
               $http.get('/exercise',  {    params: { users_id: null, created_at: calendarService.date }}).then(function(data){
              
                    self.rows = data.data;
                    self.totalMinutes = 0;
                    self.totalCalsBurned = 0;

                    for(var i = 0; i < self.rows.length; i++){
                      
                        var curRow = self.rows[i];
                        
                        self.totalMinutes +=curRow.exercises_minutes;
                        self.totalCalsBurned += curRow.exercises_calories_burned;
                    }
    
              
                 });
               
           }
           
            var exercises = [];

                   
                   var substringMatcher = function(strs) {
                       
                          return function findMatches(q, cb) {
                            var matches, substringRegex;
                           // console.log(c)
                        
                            // an array that will be populated with substring matches
                            matches = [];
                        
                            // regex used to determine if a string contains the substring `q`
                            substrRegex = new RegExp(q, 'i');
                            $http.get("/exercise/search/" +q).success(function(data) {
                                 
                                    for(var i=0; i < data.length; i++){
                                        
                                        var exercise = data[i];
                                         exercises.push(exercise.exercises_name);
                                          
                                    }

                         });
                        
                            // iterate through the pool of strings and for any string that
                            // contains the substring `q`, add it to the `matches` array
                            $.each(strs, function(i, str) {
                              if (substrRegex.test(str)) {
                                matches.push(str);
                              }
                            });
                        
                            cb(matches);
                          };
                        };
                        
                        
              $('.typeahead').typeahead({
                             
                              hint: true,
                              highlight: true,
                              limit: 2,
                              minLength: 1,
                              
                            },
                            {
                              name: 'exercises',
                              source: substringMatcher(exercises)
                      });
                        

       
            $http.get('/exercise').then(function(data) {

                if (data.data)
                    self.rows = data.data;


            });

       


        self.delete = function(row, index) {


            panel.show({
                title: "Delete a exercise",
                body: "Are you sure you want to delete " + row.exercises_name + "?",
                confirm: function() {
                    $http.delete('/exercise/' + row.exercises_id)
                        .success(function(data) {

                            self.rows.splice(index, 1);
                            alert.show(row.exercises_name + " deleted.", 'success')
                            panel.state = null;
                        }).error(function(data) {


                            alert.show(data.code, 'danger');
                        });
                        panel.state = null;
                }
            });
        }

        self.confirm = function() {


        }

        //Details button
        self.details = function(row, index) {

            editpanel.show({
                title: "Details for exercise",
                rows: row,
                editing: false,
                confirm: function() {
                    $http.delete('/exercise/' + row.exercises_id)
                        .success(function(data) {


                            self.rows.splice(index, 1);
                        }).error(function(data) {


                            alert.show(data.code, 'danger');
                        });
                }
            });
        }



        //Details button
        self.edit = function(row, index) {

            row.isEditing = true;
        }

        //Details button
        self.create = function() {

            self.rows.push({
                isEditing: true,
                exercisestypes_id: 1
            });


        }

        self.save = function(row, index) {

            
            $http.get('/login').success( function(data){
                             
                           row.users_id =  data.users_id;
                           row.created_at = calendarService.date;

                            $http.post('/exercise', row)
                            .success(function(data){
                                
                                data.isEditing = false;
                                self.rows[index] = data;
                                 alert.show(row.exercises_name + " saved for "+ row.created_at+".", 'success')
                                
                            }).error(function(data){
                                
                                alert.show(data.code , 'danger');
                                
                            });
            })
        }
    })