(function() {
	'use strict';

    // 姓名 年龄 地址 主诉 既往史 家族史 现病史 体检 检查项目 西医诊断 中医诊断 治则 治疗方法

	var app = angular.module("icyFootApp",[]);

    app.controller("GeneralController",
    function($rootScope, $scope) {
        $rootScope.fileSystem = require('fs');
        $rootScope.remote = require('remote'); 
        $rootScope.dialog = $rootScope.remote.require('dialog');

        $rootScope.dataFilePath = '';
        $rootScope.CONFIG_FILE_PATH = './app.config';
        $rootScope.INTERNAL_DATA_FILE_PATH = './app.data';

        $rootScope.itemList = [];
        $rootScope.modifyIndex = -1;

        $rootScope.getDataFilePath = function() {
            $rootScope.dialog.showSaveDialog(function (filePath) {
                $rootScope.dataFilePath = filePath;
                $rootScope.fileSystem.writeFile($rootScope.CONFIG_FILE_PATH,
                    $rootScope.dataFilePath,
                    function(err, fd) {
                    }
                );
            });
        }

        $rootScope.saveData = function() {
            $rootScope.fileSystem.writeFile($rootScope.dataFilePath,
                JSON.stringify($rootScope.itemList), 'utf-8',
                function(err, fd) {
                }
            );
            $rootScope.fileSystem.writeFile($rootScope.INTERNAL_DATA_FILE_PATH,
                JSON.stringify($rootScope.itemList), 'utf-8',
                function(err, fd) {
                    console.log(err, fd);
                }
            );
        }

        $scope.loadData = function() {
            if ($rootScope.fileSystem.existsSync($rootScope.CONFIG_FILE_PATH)) {
                $rootScope.dataFilePath = $rootScope.fileSystem.readFileSync($rootScope.CONFIG_FILE_PATH, 'utf-8');
            }

            if ($rootScope.fileSystem.existsSync($rootScope.dataFilePath)) {
                $rootScope.fileSystem.readFile($rootScope.dataFilePath, 'utf-8', function (err, data) {
                    if (err) return console.log(err);
                    $rootScope.itemList = JSON.parse(data);
                });
            } else {
                $rootScope.getDataFilePath();
            }
        }

        $scope.loadData();

        $scope.onShowModalClick = function (modalId) {
            $rootScope.modifyIndex = -1;
            if ('#add-modal' === modalId) {$rootScope.prepareAddModal(0);}
            angular.element(document.querySelector(modalId)).modal();
            console.log($rootScope.itemList);
            console.log($rootScope.dataFilePath);
        }
    });
	
	app.controller("SearchController",
    function($scope, $rootScope, $http) {
        $scope.rowClicked = function(index) {
            $rootScope.modifyIndex = index;
            $rootScope.prepareAddModal(1);
        }
    });

    app.controller("InsertController",
    function($scope, $rootScope, $http) {
        $scope.fieldList = [
            {'variableName':'name','name': '姓名'},
            {'variableName':'phone','name': '电话'},
            {'variableName':'email','name': '邮箱'},
            {'variableName':'age','name': '年龄'},
            {'variableName':'address','name': '地址'},
            {'variableName':'sympton','name': '主诉'},
            {'variableName':'personalHist','name': '既往史'},
            {'variableName':'familyHist','name': '家族史'},
            {'variableName':'currentHist','name': '现病史'},
            {'variableName':'exam','name': '体检'},
            {'variableName':'examTerms','name': '检查项目'},
            {'variableName':'medicalResult','name': '西医诊断'},
            {'variableName':'traditionalMedicalResult','name': '中医诊断'},
            {'variableName':'governs','name': '治则'},
            {'variableName':'treatment','name': '治疗方法'}
        ];

        $scope.onSaveChangeClicked = function(modifyIndex) {
            var newItem = {};
    		$scope.fieldList.forEach(function(fieldObj) {
                newItem[fieldObj['variableName']] = fieldObj['variableValue'];
            });

            if (modifyIndex < 0)
                $rootScope.itemList.push(newItem);
            else
                $rootScope.itemList[modifyIndex] = newItem;

            $rootScope.saveData();
            angular.element(document.querySelector('#add-modal')).modal('hide');
    	}

        $rootScope.prepareAddModal =function(option) {
            $scope.fieldList.forEach(function(fieldObj) {
                if (option > 0)
                    fieldObj['variableValue'] = $rootScope.itemList[$rootScope.modifyIndex][fieldObj['variableName']];
                else
                    fieldObj['variableValue'] = '';
            });

            angular.element(document.querySelector('#add-modal')).modal();
        }
    });

    app.controller("SettingController",
    function ($scope, $rootScope) {

    });
})();

