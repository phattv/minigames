"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import Link from "next/link";

const BASE_WORD_PAIRS = [
  ["Mèo", "Hổ"],
  ["Cà phê", "Trà sữa"],
  ["Pizza", "Burger"],
  ["Bác sĩ", "Y tá"],
  ["Xe máy", "Xe đạp"],
  ["iPhone", "Samsung"],
  ["Bún bò", "Phở"],
  ["TikTok", "Instagram"],
  ["Mưa", "Bão"],
  ["Kem", "Sữa chua"],
  ["Táo", "Lê"],
  ["Máy tính", "Laptop"],
  ["Đại học", "Trường học"],
  ["Máy bay", "Tàu hỏa"],
  ["Bóng đá", "Bóng rổ"],
  ["Netflix", "YouTube"],
  ["Chó", "Sói"],
  ["Điện thoại", "Máy tính bảng"],
  ["Nước ngọt", "Nước ép"],
  ["Mặt trời", "Mặt trăng"],
  ["Dầu gội", "Dầu xả"],
  ["Bánh mì", "Hamburger"],
  ["Cơm", "Cháo"],
  ["Hà Nội", "Sài Gòn"],
  ["Grab", "Be"],
  ["Momo", "ZaloPay"],
  ["Coca", "Pepsi"],
  ["Cam", "Quýt"],
  ["Bia", "Rượu"],
  ["Mì gói", "Hủ tiếu"],
  ["Cá", "Tôm"],
  ["Mực", "Bạch tuộc"],
  ["Ninja", "Samurai"],
  ["Táo đỏ", "Táo xanh"],
  ["Vision", "SH"],
  ["Rolex", "Omega"],
  ["Mercedes", "BMW"],
  ["Áo sơ mi", "Áo thun"],
  ["Giày", "Dép"],
  ["Sư tử", "Báo"],
  ["Ronaldo", "Messi"],
  ["JavaScript", "TypeScript"],
  ["React", "Vue"],
  ["Next.js", "Nuxt.js"],
  ["Macbook", "ThinkPad"],
  ["AirPods", "Galaxy Buds"],
  ["Spotify", "Apple Music"],
  ["Discord", "Telegram"],
  ["Shopee", "Lazada"],
  ["Đà Lạt", "Sa Pa"],
  ["Vịt", "Ngỗng"],
  ["Cua", "Ghẹ"],
  ["Heo quay", "Gà quay"],
  ["Lẩu", "Nướng"],
  ["Chè", "Che"],
  ["Bánh cuốn", "Bánh ướt"],
  ["Bánh tráng", "Bánh đa"],
  ["Gỏi cuốn", "Chả giò"],
  ["Sinh tố", "Nước ép"],
  ["Trà đá", "Cà phê đá"],
  ["Bida", "Bowling"],
  ["Cờ vua", "Cờ tướng"],
  ["Bài tây", "Bài tiến lên"],
  ["Karaoke", "Karaoke online"],
  ["Gym", "Yoga"],
  ["Chạy bộ", "Đạp xe"],
  ["Bơi lội", "Lặn biển"],
  ["Trượt ván", "Trượt patin"],
  ["Cầu lông", "Tennis"],
  ["Bóng chuyền", "Bóng ném"],
  ["Thầy giáo", "Giáo sư"],
  ["Cảnh sát", "Bộ đội"],
  ["Đầu bếp", "Bartender"],
  ["Kế toán", "Kiểm toán"],
  ["Lập trình viên", "Kỹ sư"],
  ["Diễn viên", "Ca sĩ"],
  ["Tiktoker", "YouTuber"],
  ["Streamer", "Gamer"],
  ["Phi công", "Tiếp viên hàng không"],
  ["Kiến trúc sư", "Kỹ sư xây dựng"],
  ["Vàng", "Bạc"],
  ["Kim cương", "Ngọc trai"],
  ["Nhẫn", "Vòng tay"],
  ["Túi xách", "Balo"],
  ["Mũ", "Nón"],
  ["Kính mắt", "Kính áp tròng"],
  ["Kem chống nắng", "Kem dưỡng da"],
  ["Son môi", "Phấn má"],
  ["Nước hoa", "Xịt khử mùi"],
  ["Sạc dự phòng", "Sạc không dây"],
  ["Tai nghe", "Loa Bluetooth"],
  ["Smart TV", "Máy chiếu"],
  ["Tủ lạnh", "Máy lạnh"],
  ["Máy giặt", "Máy sấy"],
  ["Nồi cơm điện", "Nồi chiên không dầu"],
  ["Xe hơi", "Xe tải"],
  ["Xe điện", "Xe xăng"],
  ["Tàu điện ngầm", "BRT"],
  ["Khách sạn", "Homestay"],
  ["Căn hộ", "Nhà phố"],
  ["Trăn", "Rắn"],
  ["Cá sấu", "Kỳ nhông"],
  ["Voi", "Tê giác"],
  ["Khỉ", "Vượn"],
  ["Cá heo", "Cá voi"],
  ["Đại bàng", "Diều hâu"],
  ["Vẹt", "Chim yến"],
  ["Muỗi", "Ruồi"],
  ["Ong", "Bướm"],
  ["Nho", "Dâu tây"],
  ["Xoài", "Dứa"],
  ["Mít", "Sầu riêng"],
  ["Dưa hấu", "Dưa lưới"],
  ["Chuối", "Chuối sứ"],
  ["Thanh long", "Chôm chôm"],
  ["Bơ", "Bơ sáp"],
  ["Ổi", "Mận"],
  ["Bánh flan", "Pudding"],
  ["Tiramisu", "Cheesecake"],
  ["Macaron", "Cupcake"],
  ["Sushi", "Sashimi"],
  ["Ramen", "Udon"],
  ["Dimsum", "Bánh bao"],
  ["Tteokbokki", "Bánh gạo"],
  ["Kimchi", "Dưa cải"],
  ["Bơ lạc", "Mứt"],
  ["Phô mai", "Bơ"],
  ["Muối", "Đường"],
  ["Giấm", "Chanh"],
  ["Hồ Chí Minh", "Hà Nội"],
  ["Đà Nẵng", "Nha Trang"],
  ["Phú Quốc", "Côn Đảo"],
  ["Huế", "Hội An"],
  ["Mũi Né", "Vũng Tàu"],
  ["Buôn Ma Thuột", "Pleiku"],
  ["Cần Thơ", "Mỹ Tho"],
  ["Hải Phòng", "Quảng Ninh"],
  ["Lào Cai", "Yên Bái"],
  ["Ninh Bình", "Nam Định"],
  ["ChatGPT", "Gemini"],
  ["Claude", "Copilot"],
  ["Photoshop", "Lightroom"],
  ["Figma", "Canva"],
  ["Notion", "Obsidian"],
  ["Excel", "Google Sheets"],
  ["Word", "Google Docs"],
  ["Zoom", "Google Meet"],
  ["Slack", "Teams"],
  ["GitHub", "GitLab"],
  // animals
  ["Cáo", "Chồn"],
  ["Nai", "Hươu"],
  ["Bò", "Trâu"],
  ["Lừa", "Ngựa"],
  ["Lợn", "Heo rừng"],
  ["Gà", "Vịt"],
  ["Thỏ", "Sóc"],
  ["Rùa", "Ốc sên"],
  ["Cá vàng", "Cá Koi"],
  ["Cá mập", "Cá kiếm"],
  ["Sứa", "San hô"],
  ["Tôm hùm", "Cua hoàng đế"],
  ["Gấu trúc", "Gấu bắc cực"],
  ["Hà mã", "Lợn nước"],
  ["Hươu cao cổ", "Ngựa vằn"],
  ["Flamingo", "Hạc"],
  ["Cú", "Chim cánh cụt"],
  ["Cá ngựa", "Cá nóc"],
  ["Nhện", "Bọ cạp"],
  ["Kiến", "Mối"],
  ["Dế", "Châu chấu"],
  ["Ếch", "Nhái"],
  ["Cóc", "Tắc kè"],
  ["Chim sẻ", "Chim bồ câu"],
  ["Thiên nga", "Sếu"],
  ["Cá hồi", "Cá ngừ"],
  ["Cá chép", "Cá trắm"],
  ["Lươn", "Chình"],
  ["Sên", "Ốc"],
  ["Báo đốm", "Báo hoa mai"],
  ["Gấu nâu", "Gấu đen"],
  ["Linh miêu", "Báo tuyết"],
  ["Đười ươi", "Tinh tinh"],
  ["Kangaroo", "Thú mỏ vịt"],
  ["Kiwi", "Emu"],
  ["Chim ruồi", "Chim le le"],
  ["Cò", "Vạc"],
  ["Chim công", "Chim trĩ"],
  ["Mèo rừng", "Chồn hương"],
  ["Cáo đỏ", "Cáo bắc cực"],
  ["Bò rừng", "Bò Tây Tạng"],
  ["Vượn cáo", "Khỉ đột"],
  // food & drink
  ["Bít tết", "Sườn nướng"],
  ["Gà rán", "Gà nướng"],
  ["Cá chiên", "Cá hấp"],
  ["Xôi", "Cơm lam"],
  ["Bánh xèo", "Bánh khọt"],
  ["Nem", "Chả"],
  ["Canh chua", "Canh bún"],
  ["Bún chả", "Bún riêu"],
  ["Mì quảng", "Cao lầu"],
  ["Bánh tráng trộn", "Bánh tráng nướng"],
  ["Kem que", "Kem tươi"],
  ["Matcha", "Hojicha"],
  ["Espresso", "Americano"],
  ["Latte", "Cappuccino"],
  ["Smoothie", "Milkshake"],
  ["Yogurt", "Kefir"],
  ["Croissant", "Scone"],
  ["Waffle", "Pancake"],
  ["Donut", "Bagel"],
  ["Muffin", "Brownie"],
  ["Cookie", "Cracker"],
  ["Chips", "Popcorn"],
  ["Nachos", "Tacos"],
  ["Burrito", "Quesadilla"],
  ["Pasta", "Risotto"],
  ["Steak", "Roast beef"],
  ["Bacon", "Ham"],
  ["Salami", "Pepperoni"],
  ["Tofu", "Tempeh"],
  ["Hummus", "Guacamole"],
  ["Sriracha", "Tabasco"],
  ["Ketchup", "Mustard"],
  ["Mayo", "Aioli"],
  ["Butter", "Margarine"],
  ["Cà ri", "Masala"],
  ["Phở bò", "Phở gà"],
  ["Bún mắm", "Bún kèn"],
  ["Cơm tấm", "Cơm chiên"],
  ["Lẩu Thái", "Lẩu mắm"],
  ["Bánh bèo", "Bánh nậm"],
  ["Chả cá", "Chả mực"],
  ["Nem chua", "Nem lụi"],
  ["Sữa đặc", "Sữa tươi"],
  ["Nước dừa", "Nước mía"],
  ["Whiskey", "Vodka"],
  ["Wine", "Champagne"],
  ["Gin", "Rum"],
  ["Sake", "Soju"],
  ["Oatmeal", "Granola"],
  ["Sandwich", "Wrap"],
  ["Hot dog", "Corn dog"],
  ["Fries", "Onion rings"],
  ["Paella", "Couscous"],
  ["Tagine", "Shakshuka"],
  ["Bibimbap", "Kimbap"],
  ["Pad Thai", "Som Tum"],
  ["Nasi Goreng", "Cơm chiên Dương Châu"],
  ["Pho", "Laksa"],
  ["Tonkatsu", "Katsu curry"],
  ["Takoyaki", "Okonomiyaki"],
  ["Yakitori", "Teriyaki"],
  ["Gelato", "Sorbet"],
  ["Crepe", "Blini"],
  ["Borscht", "Goulash"],
  ["Pierogi", "Dumpling"],
  ["Pretzel", "Bratwurst"],
  ["Fish and chips", "Shepherd's pie"],
  ["Curry", "Biryani"],
  ["Falafel", "Shawarma"],
  ["Pita", "Naan"],
  ["Baklava", "Halva"],
  ["Papaya", "Ổi xá lị"],
  ["Lychee", "Longan"],
  ["Rambutan", "Măng cụt"],
  ["Khế", "Thanh trà"],
  ["Taro", "Khoai lang"],
  ["Bí đỏ", "Bí xanh"],
  ["Broccoli", "Cauliflower"],
  ["Cà tím", "Ớt chuông"],
  ["Cà chua bi", "Cà chua thường"],
  ["Bubble tea", "Thai tea"],
  ["Dalgona coffee", "Cold brew"],
  ["French press", "Moka pot"],
  ["Cơm sườn", "Cơm gà"],
  ["Miến gà", "Miến lươn"],
  ["Cháo gà", "Cháo lòng"],
  ["Xôi gấc", "Xôi lạc"],
  ["Bánh trôi", "Bánh chay"],
  ["Chả lụa", "Chả quế"],
  ["Thịt kho", "Thịt luộc"],
  ["Trà đào", "Trà vải"],
  ["Sữa hạt", "Sữa yến mạch"],
  ["Protein shake", "Energy drink"],
  ["Poke bowl", "Buddha bowl"],
  // tech & apps
  ["Android", "iOS"],
  ["Windows", "MacOS"],
  ["Linux", "Unix"],
  ["Chrome", "Firefox"],
  ["Gmail", "Outlook"],
  ["WhatsApp", "Signal"],
  ["Snapchat", "BeReal"],
  ["Pinterest", "Tumblr"],
  ["Reddit", "Quora"],
  ["LinkedIn", "Indeed"],
  ["Airbnb", "Booking.com"],
  ["Uber", "Lyft"],
  ["Amazon", "eBay"],
  ["PayPal", "Stripe"],
  ["Bitcoin", "Ethereum"],
  ["Tesla", "Rivian"],
  ["AWS", "Google Cloud"],
  ["Docker", "Kubernetes"],
  ["Python", "Ruby"],
  ["Java", "Kotlin"],
  ["Swift", "Dart"],
  ["HTML", "CSS"],
  ["SQL", "NoSQL"],
  ["MongoDB", "PostgreSQL"],
  ["Nginx", "Apache"],
  ["Midjourney", "DALL-E"],
  ["Twitch", "YouTube Gaming"],
  ["Steam", "Epic Games"],
  ["PlayStation", "Xbox"],
  ["Nintendo Switch", "Steam Deck"],
  ["Minecraft", "Roblox"],
  ["Fortnite", "PUBG"],
  ["League of Legends", "Dota 2"],
  ["Valorant", "CS:GO"],
  ["GTA", "Red Dead Redemption"],
  ["The Sims", "Animal Crossing"],
  ["Zelda", "Mario"],
  ["Pokemon", "Digimon"],
  ["FIFA", "eFootball"],
  ["Overwatch", "Apex Legends"],
  ["Among Us", "Gartic Phone"],
  ["Wordle", "Connections"],
  ["Duolingo", "Babbel"],
  ["Coursera", "Udemy"],
  ["Kindle", "Kobo"],
  ["Yelp", "TripAdvisor"],
  ["Blockchain", "Web3"],
  ["5G", "Wi-Fi 7"],
  ["SSD", "HDD"],
  ["RAM", "ROM"],
  ["CPU", "GPU"],
  ["Machine learning", "Deep learning"],
  ["Cloud computing", "Edge computing"],
  ["Smart home", "IoT"],
  ["Facial recognition", "Voice recognition"],
  ["3D printing", "Laser cutting"],
  ["VR headset", "AR glasses"],
  ["Drone", "Robot"],
  ["Self-driving car", "Flying car"],
  // sports & games
  ["F1", "MotoGP"],
  ["Marathon", "Half marathon"],
  ["CrossFit", "Pilates"],
  ["Kickboxing", "Muay Thai"],
  ["Judo", "Jiu-jitsu"],
  ["Karate", "Taekwondo"],
  ["Wrestling", "Boxing"],
  ["Fencing", "Archery"],
  ["Skiing", "Snowboarding"],
  ["Surfing", "Windsurfing"],
  ["Golf", "Cricket"],
  ["Baseball", "Softball"],
  ["Rugby", "American football"],
  ["Ice hockey", "Field hockey"],
  ["Squash", "Racquetball"],
  ["Handball", "Water polo"],
  ["Rock climbing", "Bouldering"],
  ["Parkour", "Freerunning"],
  ["Skydiving", "Bungee jumping"],
  ["Scuba diving", "Snorkeling"],
  ["BMX", "Mountain biking"],
  ["Skateboarding", "Longboarding"],
  ["Gymnastics", "Acrobatics"],
  ["Synchronized swimming", "Diving"],
  ["Curling", "Ice skating"],
  ["Speed skating", "Figure skating"],
  ["Wakeboarding", "Waterskiing"],
  ["Sailing", "Yachting"],
  ["Triathlon", "Duathlon"],
  ["Poker", "Blackjack"],
  ["Mahjong", "Dominoes"],
  ["Backgammon", "Co vay"],
  ["Frisbee", "Flying disc"],
  // music
  ["Pop", "R&B"],
  ["Rock", "Metal"],
  ["Jazz", "Blues"],
  ["Hip-hop", "Rap"],
  ["Classical", "Opera"],
  ["Electronic", "Techno"],
  ["House", "Trance"],
  ["Reggae", "Ska"],
  ["Country", "Folk"],
  ["Indie", "Alternative"],
  ["K-pop", "J-pop"],
  ["V-pop", "C-pop"],
  ["Guitar", "Bass guitar"],
  ["Piano", "Keyboard"],
  ["Violin", "Viola"],
  ["Trumpet", "Trombone"],
  ["Saxophone", "Clarinet"],
  ["Drums", "Djembe"],
  ["Vinyl", "CD"],
  ["Concert", "Music festival"],
  ["Album", "EP"],
  ["Remix", "Cover version"],
  ["BTS", "Blackpink"],
  ["Taylor Swift", "Billie Eilish"],
  ["Eminem", "Drake"],
  ["Adele", "Beyonce"],
  ["Ed Sheeran", "Charlie Puth"],
  ["Son Tung M-TP", "Jack"],
  ["My Tam", "Thu Minh"],
  ["The Beatles", "The Rolling Stones"],
  ["Michael Jackson", "Prince"],
  ["Elvis Presley", "Frank Sinatra"],
  ["Madonna", "Lady Gaga"],
  ["Coldplay", "Radiohead"],
  ["Dua Lipa", "Ariana Grande"],
  ["Justin Bieber", "The Weeknd"],
  ["Maroon 5", "OneRepublic"],
  // movies & tv
  ["Marvel", "DC"],
  ["Disney", "Pixar"],
  ["Action movie", "Thriller movie"],
  ["Comedy", "Romance"],
  ["Horror", "Sci-fi"],
  ["Documentary", "Reality TV"],
  ["Anime", "Cartoon"],
  ["K-drama", "C-drama"],
  ["Oscar", "BAFTA"],
  ["Avatar", "Titanic"],
  ["Harry Potter", "Lord of the Rings"],
  ["Star Wars", "Star Trek"],
  ["Iron Man", "Captain America"],
  ["Spider-Man", "Deadpool"],
  ["Joker", "Thanos"],
  ["Doraemon", "Shin-chan"],
  ["Naruto", "One Piece"],
  ["Dragon Ball", "Bleach"],
  ["Attack on Titan", "Demon Slayer"],
  ["Studio Ghibli", "A-1 Pictures"],
  ["Friends", "How I Met Your Mother"],
  ["Breaking Bad", "Better Call Saul"],
  ["Game of Thrones", "House of the Dragon"],
  ["Squid Game", "Money Heist"],
  ["Stranger Things", "Dark"],
  ["The Office", "Parks and Recreation"],
  ["Black Mirror", "Westworld"],
  ["Sherlock", "Poirot"],
  ["Grey's Anatomy", "House M.D."],
  ["Prison Break", "Suits"],
  ["Peaky Blinders", "Narcos"],
  ["HBO", "Disney+"],
  ["Amazon Prime", "Apple TV+"],
  // world places
  ["Paris", "Rome"],
  ["London", "Berlin"],
  ["New York", "Los Angeles"],
  ["Tokyo", "Osaka"],
  ["Seoul", "Busan"],
  ["Bangkok", "Phuket"],
  ["Singapore", "Hong Kong"],
  ["Dubai", "Abu Dhabi"],
  ["Sydney", "Melbourne"],
  ["Toronto", "Vancouver"],
  ["Cairo", "Alexandria"],
  ["Cape Town", "Johannesburg"],
  ["Sao Paulo", "Rio de Janeiro"],
  ["Mumbai", "Delhi"],
  ["Beijing", "Shanghai"],
  ["Moscow", "St. Petersburg"],
  ["Amsterdam", "Brussels"],
  ["Madrid", "Barcelona"],
  ["Vienna", "Prague"],
  ["Istanbul", "Athens"],
  ["Lisbon", "Porto"],
  ["Copenhagen", "Stockholm"],
  ["Oslo", "Helsinki"],
  ["Budapest", "Bucharest"],
  ["Kyoto", "Nara"],
  ["Venice", "Florence"],
  ["Edinburgh", "Dublin"],
  ["Nairobi", "Lagos"],
  ["Casablanca", "Marrakech"],
  ["Cape Town", "Durban"],
  // fashion & brands
  ["Nike", "Adidas"],
  ["Puma", "Reebok"],
  ["Gucci", "Louis Vuitton"],
  ["Chanel", "Dior"],
  ["Prada", "Versace"],
  ["Zara", "H&M"],
  ["Uniqlo", "Gap"],
  ["Levi's", "Wrangler"],
  ["Supreme", "Stussy"],
  ["Balenciaga", "Givenchy"],
  ["Sneakers", "Boots"],
  ["Jacket", "Coat"],
  ["Hoodie", "Sweatshirt"],
  ["Jeans", "Chinos"],
  ["Suit", "Tuxedo"],
  ["Dress", "Skirt"],
  ["Leggings", "Yoga pants"],
  ["Socks", "Stockings"],
  ["Belt", "Suspenders"],
  ["Sunglasses", "Reading glasses"],
  ["Scarf", "Gloves"],
  ["Beret", "Fedora"],
  ["Flip-flops", "Sandals"],
  ["High heels", "Platform shoes"],
  ["Loafers", "Oxfords"],
  ["Bomber jacket", "Denim jacket"],
  ["Trench coat", "Peacoat"],
  ["Cargo pants", "Track pants"],
  ["Swimsuit", "Bikini"],
  // nature & environment
  ["Nui", "Doi"],
  ["Song", "Suoi"],
  ["Ho", "Ao"],
  ["Bien", "Dai duong"],
  ["Rung", "Rung nhiet doi"],
  ["Sa mac", "Thao nguyen"],
  ["Dong bang", "Cao nguyen"],
  ["Thac nuoc", "Suoi nuoc nong"],
  ["Hang dong", "Vinh bien"],
  ["Dao", "Ban dao"],
  ["Tuyet", "Bang"],
  ["Lu lut", "Han han"],
  ["Dong dat", "Song than"],
  ["Nui lua", "Geyser"],
  ["Cau vong", "Cuc quang"],
  ["Suong mu", "Suong mai"],
  ["Set", "Sam"],
  ["Bao", "Ap thap nhiet doi"],
  ["Mua xuan", "Mua thu"],
  ["Mua he", "Mua dong"],
  ["Rung Amazon", "Rung Borneo"],
  ["Thai Binh Duong", "Dai Tay Duong"],
  ["Sahara", "Gobi"],
  ["Everest", "K2"],
  ["Bac Cuc", "Nam Cuc"],
  // jobs & professions
  ["Nha bao", "Phong vien"],
  ["Luat su", "Cong to vien"],
  ["Duoc si", "Y si"],
  ["Nha tam ly", "Nha tri lieu"],
  ["Giam doc", "Quan ly"],
  ["Thu ky", "Tro ly"],
  ["Nhiet anh gia", "Quay phim"],
  ["Nha van", "Nha tho"],
  ["Dich gia", "Phien dich"],
  ["Huan luyen vien", "PT"],
  ["Barista", "Sommelier"],
  ["Huong dan vien", "Le tan"],
  ["Data analyst", "Data scientist"],
  ["Product manager", "Project manager"],
  ["UX designer", "UI designer"],
  ["DevOps", "SRE"],
  ["Tai xe", "Thuyen truong"],
  ["Cuu hoa", "Cuu ho"],
  ["Nong dan", "Ngu dan"],
  ["Tho may", "Tho theu"],
  ["Tho moc", "Tho xay"],
  ["Sous chef", "Pastry chef"],
  ["Stylist", "Makeup artist"],
  ["Mixologist", "Bartender chuyen nghiep"],
  // household & home
  ["Sofa", "Ghe banh"],
  ["Ban an", "Ban cafe"],
  ["Giuong doi", "Giuong don"],
  ["Tu quan ao", "Ke sach"],
  ["Den chum", "Den san"],
  ["Rem cua", "Manh tre"],
  ["Tham", "San go"],
  ["Bep gas", "Bep tu"],
  ["Lo vi song", "Lo nuong"],
  ["May xay sinh to", "May ep trai cay"],
  ["Binh loc nuoc", "May loc nuoc"],
  ["Ban ui", "May hap quan ao"],
  ["May hut bui", "Robot lau nha"],
  ["Khoa thong minh", "Camera an ninh"],
  ["Be ca", "Chau cay"],
  ["Binh hoa", "Nen thom"],
  ["Goi", "Chan bong"],
  ["Bon tam", "Voi sen"],
  // education
  ["Toan", "Vat ly"],
  ["Hoa hoc", "Sinh hoc"],
  ["Van hoc", "Lich su"],
  ["But chi", "But muc"],
  ["Thuoc ke", "Compa"],
  ["Vo", "Sach giao khoa"],
  ["Bang den", "Bang trang"],
  ["Kinh hien vi", "Kinh thien van"],
  ["Thu vien", "Phong lab"],
  ["Hoc bong", "Hoc phi"],
  ["Tieu hoc", "THCS"],
  ["THPT", "Cao dang"],
  ["Cu nhan", "Thac si"],
  ["Tien si", "Giao su"],
  // health
  ["Vitamin C", "Vitamin D"],
  ["Protein", "Carbohydrate"],
  ["Thuoc vien", "Thuoc tiem"],
  ["Huyet ap", "Duong huyet"],
  ["Benh vien", "Phong kham tu"],
  ["Phau thuat", "Noi soi"],
  ["Vaccine", "Khang sinh"],
  ["Di ung", "Cam cum"],
  ["Thien", "Yoga nidra"],
  ["Detox", "Intermittent fasting"],
  ["Cardio", "Weight training"],
  // finance
  ["Chung khoan", "Trai phieu"],
  ["USD", "EUR"],
  ["VND", "JPY"],
  ["Ngan hang", "Quy tin dung"],
  ["The tin dung", "The ghi no"],
  ["Tiet kiem", "Dau tu"],
  ["Startup", "SME"],
  ["CEO", "CFO"],
  ["Loi nhuan", "Doanh thu"],
  ["Hop dong", "Thoa thuan"],
  ["Lai suat", "Lam phat"],
  ["GDP", "CPI"],
  ["Xuat khau", "Nhap khau"],
  ["E-commerce", "Retail"],
  ["B2B", "B2C"],
  ["IPO", "M&A"],
  ["Crypto", "Stock market"],
  // space & science
  ["Sao Hoa", "Sao Tho"],
  ["Ho den", "Sao neutron"],
  ["Thien ha", "Tinh van"],
  ["Thien thach", "Sao choi"],
  ["SpaceX", "NASA"],
  ["Kinh vien vong", "Dai thien van"],
  ["Nguyen tu", "Phan tu"],
  ["DNA", "RNA"],
  ["Tien hoa", "Di truyen"],
  ["Big Bang", "Vu tru song song"],
  ["Nhiet hach", "Phan hach"],
  ["CRISPR", "Gene therapy"],
  // mythology & pop culture
  ["Rong", "Phuong hoang"],
  ["Ky lan", "Nhan ma"],
  ["Vampire", "Nguoi soi"],
  ["Zombie", "Xac song"],
  ["Than", "Quy"],
  ["Phu thuy", "Phap su"],
  ["Nguoi khong lo", "Nguoi lun"],
  ["Hercules", "Achilles"],
  ["Zeus", "Poseidon"],
  ["Odin", "Thor"],
  ["Frankenstein", "Dracula"],
  ["Sherlock Holmes", "Hercule Poirot"],
  ["James Bond", "Jason Bourne"],
  ["Gandalf", "Dumbledore"],
  ["Voldemort", "Sauron"],
  // history
  ["Napoleon", "Caesar"],
  ["Cleopatra", "Nefertiti"],
  ["Einstein", "Newton"],
  ["Leonardo da Vinci", "Michelangelo"],
  ["Shakespeare", "Dickens"],
  ["Mozart", "Beethoven"],
  ["Picasso", "Van Gogh"],
  ["Gandhi", "Mandela"],
  ["Martin Luther King", "Malcolm X"],
  ["Nguyen Du", "Ho Xuan Huong"],
  ["Quang Trung", "Gia Long"],
  ["Hai Ba Trung", "Ba Trieu"],
  // colors & materials
  ["Do", "Cam"],
  ["Vang", "Xanh la"],
  ["Xanh duong", "Tim"],
  ["Hong", "Be"],
  ["Den", "Trang"],
  ["Xam", "Nau"],
  ["Bach kim", "Vang hong"],
  ["Thep", "Nhom"],
  ["Dong", "Dong thau"],
  ["Go soi", "Go thong"],
  ["Da cam thach", "Da granite"],
  ["Lua", "Gam"],
  ["Cotton", "Polyester"],
  ["Len", "Cashmere"],
  ["Da that", "Da gia"],
  ["Nhua", "Cao su"],
  ["Thuy tinh", "Pha le"],
  // transport
  ["Xe buyt", "Xe khach"],
  ["Taxi", "Xe om"],
  ["Tau cao toc", "Tau thuong"],
  ["Cap treo", "Gondola"],
  ["Xe Limousine", "Xe SUV"],
  ["Xe pickup", "Xe Van"],
  ["Xe the thao", "Xe sedan"],
  ["Scooter", "Moped"],
  ["Thuyen", "Canoe"],
  ["Du thuyen", "Tau san bay"],
  ["Khinh khi cau", "Truc thang"],
  ["Xe day", "Xe lan"],
  ["Hoverboard", "Xe dien can bang"],
  // social media & internet
  ["Meme", "GIF"],
  ["Reel", "Story"],
  ["Hashtag", "Trending"],
  ["Influencer", "Brand ambassador"],
  ["Follower", "Subscriber"],
  ["Like", "Share"],
  ["DM", "Tag"],
  ["Filter", "Preset"],
  ["Collab", "Duet"],
  ["Unboxing", "Review"],
  ["Challenge", "Trend"],
  ["Podcast", "Audiobook"],
  ["Newsletter", "Blog"],
  ["Vlog", "Short film"],
  ["Livestream", "Webinar"],
  ["Dark mode", "Light mode"],
  // vietnamese culture
  ["Ao dai", "Ao ba ba"],
  ["Non la", "Non coi"],
  ["Tet Nguyen Dan", "Tet Trung Thu"],
  ["Den long", "Phao hoa"],
  ["Banh chung", "Banh tet"],
  ["Li xi", "Bao thu"],
  ["Mua lan", "Mua rong"],
  ["Quan ho", "Cai luong"],
  ["Cheo", "Tuong"],
  ["Don ca tai tu", "Nha nhac"],
  ["Tranh Dong Ho", "Tranh lua"],
  ["Gom Bat Trang", "Gom Binh Duong"],
  ["Chua", "Dinh lang"],
  ["Phong thuy", "Tu vi"],
  ["Dong y", "Tay y"],
  // international culture & events
  ["Halloween", "Thanksgiving"],
  ["Christmas", "Easter"],
  ["Diwali", "Holi"],
  ["Ramadan", "Eid"],
  ["Carnival", "Oktoberfest"],
  ["Valentine's Day", "White Day"],
  ["Black Friday", "Cyber Monday"],
  ["Olympics", "Paralympics"],
  ["Grammy", "MTV VMAs"],
  ["Cannes", "Sundance"],
  ["Comic-Con", "E3"],
  ["Stand-up comedy", "Improv comedy"],
  ["Musical", "Opera show"],
  ["Ballet", "Contemporary dance"],
  ["Fashion Week", "Design Week"],
  // everyday objects
  ["Ban chai", "Luoc"],
  ["Xa phong", "Sua tam"],
  ["Kem danh rang", "Nuoc suc mieng"],
  ["Khan tam", "Khan mat"],
  ["Guong phong tam", "Guong soi"],
  ["Chia khoa", "The tu"],
  ["Vi", "Tui deo that lung"],
  ["Day sac", "Cap USB"],
  ["Bong den", "Den LED"],
  ["O dien", "Cong tac"],
  ["Bang keo", "Keo dan"],
  ["Keo", "Dao cat giay"],
  ["But bi", "But gel"],
  ["Tay", "Got but chi"],
  ["Ghim", "Kep giay"],
  ["Lich treo tuong", "So tay"],
  ["Muong", "Dua"],
  ["Chen", "Bat"],
  ["Noi", "Chao"],
  ["Thot", "Ro"],
  // abstract & concepts
  ["Sang", "Toi"],
  ["Nong", "Lanh"],
  ["To", "Nho"],
  ["Nhanh", "Cham"],
  ["Cao", "Thap"],
  ["Gia", "Tre"],
  ["Thanh thi", "Nong thon"],
  ["Huong noi", "Huong ngoai"],
  ["Ly thuyet", "Thuc hanh"],
  ["Online", "Offline"],
  ["Full-time", "Part-time"],
  ["Freelance", "9-to-5"],
  ["Remote work", "On-site"],
  // arts & hobbies
  ["Ve tranh", "Dieu khac"],
  ["Thu phap", "Origami"],
  ["Dan", "Moc len"],
  ["Nhieu anh", "Quay phim"],
  ["Lam vuon", "Trong bonsai"],
  ["Suu tam tem", "Suu tam coin"],
  ["Lego", "Rubik"],
  ["Sudoku", "Crossword"],
  ["Doc sach", "Nghe audiobook"],
  ["Cosplay", "Roleplay"],
  ["Di phuot", "Du lich bui"],
  ["Leo nui", "Cam trai"],
  // travel
  ["Passport", "Visa"],
  ["Check-in", "Check-out"],
  ["Direct flight", "Layover"],
  ["First class", "Economy class"],
  ["Penthouse", "Studio apartment"],
  ["Bungalow", "Villa"],
  ["Tent", "Hammock"],
  ["Bonfire", "BBQ"],
  ["Sunrise", "Sunset"],
  ["Road trip", "Backpacking"],
  ["Luxury travel", "Budget travel"],
  ["Solo travel", "Group tour"],
  ["City break", "Beach holiday"],
  // childhood & fun
  ["Tron tim", "U oa"],
  ["Nhay day", "Nhay lo co"],
  ["Bi", "Con quay"],
  ["Tha dieu", "Ban sung nuoc"],
  ["But mau", "Mau nuoc"],
  ["Dat nan", "Dat set tre em"],
  ["Puzzle", "Jigsaw"],
  ["Bup be", "Sieu nhan"],
  ["Xe do choi", "Tau hoa do choi"],
  ["Truyen tranh", "Truyen chu"],
  ["Bong bong", "Bong bong xa phong"],
  ["Cau truot", "Xich du"],
  // more food
  ["Pho ga", "Pho bo"],
  ["Banh mi chay", "Banh mi thit"],
  ["Lau ca", "Lau hai san"],
  ["Bun dau", "Bun cha"],
  ["Chao tom", "Chao ech"],
  ["Com chien duong chau", "Com chien thai"],
  ["Ga hap gung", "Ga kho gung"],
  ["Tom rang muoi", "Tom chien bot"],
  ["Ca kho to", "Ca nuc kho"],
  ["Suon xao chua ngot", "Suon ram man"],
  ["Dau hu chien", "Dau hu non"],
  ["Banh canh", "Banh da tron"],
  ["Mi Quang", "Mi hoanh thanh"],
  ["Chao ca", "Chao do bien"],
  ["Sinh to bo", "Sinh to xoai"],
  ["Nuoc chanh", "Nuoc cam ep"],
  ["Sua tuoi", "Sua chua uong"],
  ["Ca phe trung", "Ca phe muoi"],
  ["Tra hoa cuc", "Tra cam thao"],
  ["Kem dua", "Kem matcha"],
  // more tech
  ["TypeScript", "JavaScript"],
  ["GraphQL", "REST API"],
  ["React Native", "Flutter"],
  ["Tailwind", "Bootstrap"],
  ["Figma", "Sketch"],
  ["VS Code", "IntelliJ"],
  ["Terminal", "PowerShell"],
  ["npm", "yarn"],
  ["Git", "SVN"],
  ["Jira", "Trello"],
  ["Confluence", "Notion"],
  ["Postman", "Insomnia"],
  ["Jenkins", "GitHub Actions"],
  ["Terraform", "Ansible"],
  ["Redis", "Memcached"],
  ["Kafka", "RabbitMQ"],
  ["Elasticsearch", "Solr"],
  ["Prometheus", "Grafana"],
  ["Cloudflare", "Akamai"],
  ["Stripe", "Braintree"],
  // more sports
  ["Yoga", "Tai chi"],
  ["Kickball", "Dodgeball"],
  ["Tetherball", "Volleyball"],
  ["Mini golf", "Disc golf"],
  ["Paintball", "Airsoft"],
  ["Arm wrestling", "Thumb wrestling"],
  ["Tug of war", "Relay race"],
  ["Trampoline", "Gymnastics floor"],
  ["Obstacle course", "Mud run"],
  ["Kendo", "Fencing"],
  ["Sumo", "Greco-Roman wrestling"],
  ["Capoeira", "Breakdancing"],
  ["Slacklining", "Tightrope walking"],
  ["Base jumping", "Wingsuit flying"],
  ["Paragliding", "Hang gliding"],
  ["Horseback riding", "Polo"],
  ["Dog sledding", "Snowshoeing"],
  ["Orienteering", "Geocaching"],
  ["Ultimate frisbee", "Quidditch"],
  ["Roller derby", "Speed skating"],
  // more music
  ["Lo-fi", "Chillhop"],
  ["Drum and bass", "Dubstep"],
  ["Afrobeats", "Amapiano"],
  ["Bossa nova", "Samba"],
  ["Flamenco", "Tango"],
  ["Gospel", "Soul"],
  ["Bluegrass", "Americana"],
  ["New wave", "Post-punk"],
  ["Shoegaze", "Dream pop"],
  ["Synthwave", "Retrowave"],
  ["Trap", "Drill"],
  ["Mumble rap", "Conscious rap"],
  ["Hardstyle", "Hardcore techno"],
  ["Ambient", "New age"],
  ["World music", "Ethnic fusion"],
  ["Ukulele", "Banjo"],
  ["Cello", "Double bass"],
  ["French horn", "Tuba"],
  ["Flute", "Oboe"],
  ["Harp", "Lyre"],
  // more places
  ["Hanoi Old Quarter", "Ho Chi Minh Ben Thanh"],
  ["Mekong Delta", "Mekong River"],
  ["Ha Long Bay", "Phong Nha Cave"],
  ["My Son", "Angkor Wat"],
  ["Bali", "Lombok"],
  ["Maldives", "Seychelles"],
  ["Santorini", "Mykonos"],
  ["Amalfi Coast", "Cinque Terre"],
  ["Swiss Alps", "Austrian Tyrol"],
  ["Patagonia", "Amazon Rainforest"],
  ["Saharan desert", "Namib desert"],
  ["Great Barrier Reef", "Coral Triangle"],
  ["Niagara Falls", "Angel Falls"],
  ["Machu Picchu", "Chichen Itza"],
  ["Colosseum", "Parthenon"],
  ["Eiffel Tower", "Big Ben"],
  ["Taj Mahal", "Petra"],
  ["Pyramids", "Sphinx"],
  ["Times Square", "Piccadilly Circus"],
  ["Golden Gate", "Brooklyn Bridge"],
  // more everyday
  ["Umbrella", "Raincoat"],
  ["Flashlight", "Candle"],
  ["Alarm clock", "Wall clock"],
  ["Thermometer", "Barometer"],
  ["Compass", "GPS"],
  ["Map", "Atlas"],
  ["Notebook", "Planner"],
  ["Stapler", "Hole puncher"],
  ["Whiteboard", "Blackboard"],
  ["Projector", "Screen"],
  ["Printer", "Scanner"],
  ["Shredder", "Laminator"],
  ["File cabinet", "Bookshelf"],
  ["Desk lamp", "Floor lamp"],
  ["Office chair", "Standing desk"],
  ["Coffee mug", "Travel tumbler"],
  ["Water bottle", "Flask"],
  ["Lunchbox", "Thermos"],
  ["Shopping cart", "Shopping basket"],
  ["Loyalty card", "Gift card"],
  // more abstract
  ["Past", "Future"],
  ["Reality", "Fantasy"],
  ["Science", "Art"],
  ["Logic", "Intuition"],
  ["Competition", "Cooperation"],
  ["Individual", "Team"],
  ["Leader", "Follower"],
  ["Teacher", "Student"],
  ["Question", "Answer"],
  ["Problem", "Solution"],
  ["Risk", "Reward"],
  ["Short-term", "Long-term"],
  ["Quality", "Quantity"],
  ["Simple", "Complex"],
  ["Analog", "Digital"],
  ["Manual", "Automatic"],
  ["Open source", "Proprietary"],
  ["Centralized", "Decentralized"],
  ["Synchronous", "Asynchronous"],
  ["Vertical", "Horizontal"],
  ["Optimist", "Pessimist"],
  ["Introvert", "Ambivert"],
  ["Morning person", "Night owl"],
  ["Minimalist", "Maximalist"],
  ["Vegan", "Vegetarian"],
  ["Gluten-free", "Dairy-free"],
  ["Organic", "Conventional"],
  ["Homemade", "Store-bought"],
  ["Slow food", "Fast food"],
  ["Table tennis", "Ping pong"],
  ["Street food", "Fine dining"],
  ["Brunch", "Afternoon tea"],
  ["Happy hour", "After-party"],
  ["Tailgate", "House party"],
  ["Pen pal", "Email friend"],
  ["Snail mail", "Express mail"],
  ["Landline", "Fax machine"],
  ["Pager", "Walkie-talkie"],
  ["Cassette", "8-track"],
  ["VHS", "Betamax"],
  ["Flip phone", "Brick phone"],
  ["Dial-up", "Broadband"],
  ["Floppy disk", "Zip drive"],
  ["CRT monitor", "LCD monitor"],
  ["Trackball", "Touchpad"],
  ["Mechanical keyboard", "Membrane keyboard"],
  ["Gaming chair", "Bean bag"],
  ["Curved monitor", "Ultrawide monitor"],
  ["Noise-cancelling", "Open-back headphones"],
  ["Smart watch", "Fitness tracker"],
  ["E-reader", "Tablet"],
  ["Action camera", "Mirrorless camera"],
  ["Tripod", "Gimbal"],
  ["Ring light", "Softbox"],
  ["Green screen", "Virtual background"],
  ["Mic stand", "Boom arm"],
  ["Pop filter", "Windscreen"],
  ["Audio interface", "Mixer"],
  ["MIDI keyboard", "Synthesizer"],
  ["Turntable", "CDJ"],
  ["Karaoke machine", "Karaoke app"],
  ["Arcade machine", "Pinball machine"],
  ["Slot machine", "Lottery ticket"],
  ["Board game", "Card game"],
  ["Tabletop RPG", "Video game RPG"],
  ["Escape room", "Murder mystery"],
  ["Theme park", "Water park"],
  ["Carnival", "Circus"],
  ["Zoo", "Aquarium"],
  ["Museum", "Art gallery"],
  ["Planetarium", "Observatory"],
  ["Botanical garden", "Nature reserve"],
  ["National park", "State park"],
  ["Campground", "RV park"],
  ["Hostel", "Motel"],
  ["Resort", "Spa hotel"],
  ["Cruise ship", "River boat"],
  ["Ferry", "Hydrofoil"],
  ["Cable car", "Ski lift"],
  ["Sunrise hike", "Sunset hike"],
];

// Fisher-Yates — operates on a copy so the original array is never mutated
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Role = "civilian" | "undercover" | "whitehat";

interface Player {
  name: string;
  role: Role;
  word: string;
  eliminated: boolean;
}

export default function UndercoverPage() {
  // Shuffled once on mount and held stable — re-renders don't re-shuffle the deck
  const WORD_PAIRS = useMemo(() => shuffle([...BASE_WORD_PAIRS]), []);

  // Three-phase flow: setup (enter players) → reveal (each person sees their word) → game (voting)
  const [phase, setPhase] = useState<"setup" | "reveal" | "game">("setup");
  const [nameInput, setNameInput] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [whiteHatCount, setWhiteHatCount] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [civilianWord, setCivilianWord] = useState("");
  const [undercoverWord, setUndercoverWord] = useState("");
  // Which player card is currently showing its word — only one at a time so others can't peek
  const [currentReveal, setCurrentReveal] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  // Tracks pairs used across rounds in this session so the same pair doesn't repeat
  const [usedPairs, setUsedPairs] = useState<string[]>([]);
  // True when the whitehat is the last player standing and gets one guess at the civilian word
  const [pendingWhiteHatGuess, setPendingWhiteHatGuess] = useState(false);
  const [whiteHatGuessInput, setWhiteHatGuessInput] = useState("");
  // Index into gamePlayers for who is currently speaking — advances with the "Tiếp theo" button
  const [currentSpeakerIdx, setCurrentSpeakerIdx] = useState(0);

  const alivePlayers = useMemo(
    () => gamePlayers.filter((p) => !p.eliminated),
    [gamePlayers],
  );
  const undercoverAlive = useMemo(
    () => alivePlayers.filter((p) => p.role === "undercover").length,
    [alivePlayers],
  );
  const civilianAlive = useMemo(
    () => alivePlayers.filter((p) => p.role === "civilian").length,
    [alivePlayers],
  );
  const whiteHatAlive = useMemo(
    () => alivePlayers.filter((p) => p.role === "whitehat").length,
    [alivePlayers],
  );

  const addPlayer = () => {
    const trimmed = nameInput.trim();
    if (!trimmed || players.includes(trimmed)) return;
    setPlayers([...players, trimmed]);
    setNameInput("");
  };

  const removePlayer = (name: string) =>
    setPlayers(players.filter((p) => p !== name));

  // Advance to the next alive player, wrapping around the list
  const advanceSpeaker = (currentPlayers: Player[] = gamePlayers) => {
    const total = currentPlayers.length;
    let next = (currentSpeakerIdx + 1) % total;
    let attempts = 0;
    while (currentPlayers[next]?.eliminated && attempts < total) {
      next = (next + 1) % total;
      attempts++;
    }
    setCurrentSpeakerIdx(next);
  };

  const setupGame = () => {
    if (players.length < 3) {
      alert("Cần ít nhất 3 người chơi");
      return;
    }
    if (undercoverCount >= players.length) {
      alert("Số gián điệp phải ít hơn số người chơi");
      return;
    }
    if (whiteHatCount > 1) {
      alert("Chỉ được tối đa 1 mũ trắng");
      return;
    }
    if (undercoverCount + whiteHatCount >= players.length) {
      alert("Cần ít nhất 1 dân thường");
      return;
    }

    // Prefer unused pairs; fall back to the full list only when all have been seen
    const available = WORD_PAIRS.filter(
      (p) => !usedPairs.includes(p.join("|")),
    );
    const pool = available.length > 0 ? available : WORD_PAIRS;
    const pair = pool[Math.floor(Math.random() * pool.length)];
    // "|" is safe as a separator because none of the words contain it
    setUsedPairs((prev) => [...prev, pair.join("|")]);

    // Randomly decide which half of the pair civilians get — stops undercover from
    // always being "the harder / less common word" once players learn the pattern
    const normalFirst = Math.random() > 0.5;
    const civilian = normalFirst ? pair[0] : pair[1];
    const undercover = normalFirst ? pair[1] : pair[0];
    setCivilianWord(civilian);
    setUndercoverWord(undercover);

    // Shuffle player order before slicing so roles aren't biased toward insertion order
    const shuffled = shuffle(players);
    const undercoverNames = shuffled.slice(0, undercoverCount);
    const whiteHatNames = shuffled.slice(
      undercoverCount,
      undercoverCount + whiteHatCount,
    );

    const assigned: Player[] = players.map((name) => {
      if (undercoverNames.includes(name))
        return {
          name,
          role: "undercover",
          word: undercover,
          eliminated: false,
        };
      if (whiteHatNames.includes(name))
        return {
          name,
          role: "whitehat",
          word: "❓ Không có từ khoá",
          eliminated: false,
        };
      return { name, role: "civilian", word: civilian, eliminated: false };
    });

    // Randomise the speaking/reveal order. If whitehat lands at position 0 they'd
    // be obvious immediately (nothing to say), so swap them somewhere into the middle.
    const ordered = shuffle(assigned);
    const whIdx = ordered.findIndex((p) => p.role === "whitehat");
    if (whIdx === 0 && ordered.length > 1) {
      const to = 1 + Math.floor(Math.random() * (ordered.length - 1));
      [ordered[0], ordered[to]] = [ordered[to], ordered[0]];
    }

    setGamePlayers(ordered);
    setCurrentSpeakerIdx(0);
    setPhase("reveal");
    setWinner(null);
  };

  const eliminatePlayer = (index: number) => {
    if (winner || pendingWhiteHatGuess) return;
    const updated = [...gamePlayers];
    if (updated[index].eliminated) return;
    updated[index].eliminated = true;
    setGamePlayers(updated);

    // If the eliminated player was the current speaker, move to the next one
    if (index === currentSpeakerIdx) advanceSpeaker(updated);

    const undercoverLeft = updated.filter(
      (p) => p.role === "undercover" && !p.eliminated,
    ).length;
    const civilianLeft = updated.filter(
      (p) => p.role === "civilian" && !p.eliminated,
    ).length;
    const whiteHatLeft = updated.filter(
      (p) => p.role === "whitehat" && !p.eliminated,
    ).length;

    // Whitehat survived to the end alone — give them one chance to guess the civilian word
    if (civilianLeft === 0 && undercoverLeft === 0 && whiteHatLeft === 1) {
      setPendingWhiteHatGuess(true);
      return;
    }
    // All threats eliminated — civilians win
    if (undercoverLeft === 0 && whiteHatLeft === 0) {
      setWinner("Dân thường thắng 🎉");
      return;
    }
    // No civilians left and no whitehat to save them — undercover wins
    if (civilianLeft === 0 && whiteHatLeft === 0) {
      setWinner("Gián điệp thắng 🕵️");
    }
  };

  const submitWhiteHatGuess = () => {
    setWinner(
      whiteHatGuessInput.trim().toLowerCase() === civilianWord.toLowerCase()
        ? "Mũ trắng thắng 🤍"
        : "Mũ trắng đoán sai 😢",
    );
    setPendingWhiteHatGuess(false);
    setWhiteHatGuessInput("");
  };

  const resetGame = () => {
    setPhase("setup");
    setGamePlayers([]);
    setCurrentReveal(null);
    setCurrentSpeakerIdx(0);
    setWinner(null);
    setPendingWhiteHatGuess(false);
    setWhiteHatGuessInput("");
    // usedPairs intentionally not reset — keeps deduplication across multiple rounds
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground inline-block mb-4">
        ← Home
      </Link>
      <h1 className="text-2xl font-bold mb-6">Undercover 🕵️</h1>

      <div className="space-y-4">
        {phase === "setup" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Thêm người chơi
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  placeholder="Nhập tên"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
                <Button onClick={addPlayer}>Thêm</Button>
              </div>
            </div>

            {players.length > 0 && (
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span>{player}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlayer(player)}
                    >
                      Xoá
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Gián điệp
                </label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, players.length - 1)}
                  value={undercoverCount}
                  onChange={(e) => setUndercoverCount(Number(e.target.value))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Mũ trắng
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  value={whiteHatCount}
                  onChange={(e) => setWhiteHatCount(Number(e.target.value))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
              </div>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div className="font-medium">Điều kiện thắng</div>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    👥{" "}
                    <span className="font-medium text-foreground">
                      Dân thường
                    </span>{" "}
                    — thắng khi loại hết tất cả gián điệp và mũ trắng
                  </div>
                  <div>
                    🕵️{" "}
                    <span className="font-medium text-foreground">
                      Gián điệp
                    </span>{" "}
                    — thắng khi số gián điệp bằng hoặc nhiều hơn số dân thường
                    còn lại
                  </div>
                  <div>
                    🤍{" "}
                    <span className="font-medium text-foreground">
                      Mũ trắng
                    </span>{" "}
                    — thắng nếu là người cuối cùng còn lại và đoán đúng từ khoá
                    của dân thường
                  </div>
                </div>
                <div className="border-t pt-3 text-muted-foreground space-y-1">
                  <div>
                    🗣️ Mỗi lượt: từng người nói 1 gợi ý, sau đó biểu quyết loại
                    1 người
                  </div>
                  <div>
                    📱 Thứ tự nói = thứ tự nhận điện thoại khi xem từ khoá
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={setupGame}>
              Bắt đầu game
            </Button>
          </div>
        )}

        {phase === "reveal" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                📱 Chuyền điện thoại theo thứ tự dưới đây. Mỗi người bấm
                &quot;Xem từ khoá&quot;, ghi nhớ rồi ẩn lại trước khi chuyền
                tiếp.
              </CardContent>
            </Card>

            {gamePlayers.map((player, index) => (
              <Card key={player.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-muted-foreground font-normal text-sm">
                      #{index + 1}
                    </span>
                    {player.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentReveal === index ? (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-foreground text-background p-6 text-center">
                        <div className="text-xs opacity-60 mb-3">
                          Từ khoá của bạn
                        </div>
                        <div className="text-2xl font-bold">{player.word}</div>
                        {player.role === "whitehat" && (
                          <div className="mt-3 text-xs opacity-60">
                            Bạn là Mũ trắng 🤍
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentReveal(null)}
                      >
                        Ẩn &amp; chuyền cho người tiếp theo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setCurrentReveal(index)}
                    >
                      Xem từ khoá
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              className="w-full"
              size="lg"
              onClick={() => setPhase("game")}
            >
              Bắt đầu chơi
            </Button>
          </div>
        )}

        {phase === "game" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Dân thường", count: civilianAlive },
                { label: "Gián điệp", count: undercoverAlive },
                { label: "Mũ trắng", count: whiteHatAlive },
              ].map(({ label, count }) => (
                <Card key={label}>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {label}
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pendingWhiteHatGuess && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Mũ trắng đoán từ khoá 🤍
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Đoán từ khoá của phe dân thường:
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={whiteHatGuessInput}
                      onChange={(e) => setWhiteHatGuessInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && submitWhiteHatGuess()
                      }
                      placeholder="Nhập từ khoá"
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                    />
                    <Button onClick={submitWhiteHatGuess}>Đoán</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {winner && (
              <Card>
                <CardContent className="pt-4 text-center space-y-2">
                  <div className="text-xl font-bold">{winner}</div>
                  <div className="text-sm text-muted-foreground">
                    Từ dân thường:{" "}
                    <span className="font-semibold text-foreground">
                      {civilianWord}
                    </span>
                    <br />
                    Từ gián điệp:{" "}
                    <span className="font-semibold text-foreground">
                      {undercoverWord}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {gamePlayers.map((player, index) => {
                const isSpeaking =
                  !player.eliminated &&
                  index === currentSpeakerIdx &&
                  !winner &&
                  !pendingWhiteHatGuess;
                return (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between rounded-lg border px-3 py-3 transition-all ${
                      player.eliminated
                        ? "opacity-40 bg-muted border-border"
                        : isSpeaking
                          ? "bg-primary/5 border-primary ring-1 ring-primary/30"
                          : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs w-4 shrink-0">
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="font-medium text-sm flex items-center gap-1.5">
                          {isSpeaking && <span>🎙️</span>}
                          {player.name}
                        </div>
                        <Badge
                          variant={
                            player.eliminated
                              ? "outline"
                              : isSpeaking
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {player.eliminated
                            ? "Đã bị loại"
                            : isSpeaking
                              ? "Đang nói"
                              : "Chờ"}
                        </Badge>
                      </div>
                    </div>
                    {!player.eliminated && !winner && !pendingWhiteHatGuess && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => eliminatePlayer(index)}
                      >
                        Loại
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {!winner && !pendingWhiteHatGuess && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => advanceSpeaker()}
              >
                Tiếp theo →
              </Button>
            )}

            <Button className="w-full" size="lg" onClick={resetGame}>
              Chơi lại
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
