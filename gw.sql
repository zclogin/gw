SET NAMES UTF8;
DROP DATABASE IF EXISTS gw;
CREATE DATABASE GW CAHRSET=UTF8;
USE gw;
#网站的基本信息
CREATE TABLE gw_site_info(
	site_name VARCHAR(16),
	logo VARCHAR(64),
	copyright VARCHAR(64)
);
INSERT INTO gw_site_info VALUES("","images/logo.png","");
#网站导航
CREATE TABLE gw_nav_item(
	name VARCAHR(16),
	url VARCAHR(64),
	title VARCAHR(32)
);
INSERT INTO gw_nav_item VALUES("商城首页","/index.html","");

#轮播图
CREATE TABLE gw_carousel_item(
	cid INT PRIMARY KEY AUTO_INCREMENT,
	pic VARCHAR(128),
	url VARCHAR(128),
	title VARCAHR(32)
);
INSERT INTO gw_carousel_item VALUES(NULL,"","");

#商品列表


