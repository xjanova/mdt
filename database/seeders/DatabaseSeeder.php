<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\SalesReport;
use App\Models\Workflow;
use App\Models\WorkflowStep;
use App\Models\Problem;
use App\Models\ProblemPhoto;
use App\Models\ProblemComment;
use App\Models\Communication;
use App\Models\CommunicationRecipient;
use App\Models\CommunicationReply;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // === สาขา (Branches) ===
        $branches = [
            ['name' => 'สาขาเซ็นทรัล ลาดพร้าว', 'code' => 'BR001', 'store_name' => 'เซ็นทรัล ลาดพร้าว', 'location' => 'กรุงเทพฯ', 'region' => 'กรุงเทพฯ และปริมณฑล', 'phone' => '02-111-1111'],
            ['name' => 'สาขาเมกาบางนา', 'code' => 'BR002', 'store_name' => 'เมกาบางนา', 'location' => 'สมุทรปราการ', 'region' => 'กรุงเทพฯ และปริมณฑล', 'phone' => '02-222-2222'],
            ['name' => 'สาขาเซ็นทรัล เชียงใหม่', 'code' => 'BR003', 'store_name' => 'เซ็นทรัล เชียงใหม่', 'location' => 'เชียงใหม่', 'region' => 'ภาคเหนือ', 'phone' => '053-111-111'],
            ['name' => 'สาขาเซ็นทรัล ขอนแก่น', 'code' => 'BR004', 'store_name' => 'เซ็นทรัล ขอนแก่น', 'location' => 'ขอนแก่น', 'region' => 'ภาคอีสาน', 'phone' => '043-111-111'],
            ['name' => 'สาขาเซ็นทรัล ภูเก็ต', 'code' => 'BR005', 'store_name' => 'เซ็นทรัล ภูเก็ต', 'location' => 'ภูเก็ต', 'region' => 'ภาคใต้', 'phone' => '076-111-111'],
        ];

        foreach ($branches as $b) {
            Branch::create($b);
        }

        // === ผู้ใช้งาน & พนักงาน ===
        $usersData = [
            // ส่วนกลาง
            ['name' => 'สมชาย วงศ์ใหญ่', 'email' => 'somchai@wooddoor.co.th', 'role' => 'central_admin', 'position' => 'ผู้จัดการส่วนกลาง', 'branch_id' => null, 'code' => 'EMP001'],
            ['name' => 'สุดา แก้วมณี', 'email' => 'suda@wooddoor.co.th', 'role' => 'manager', 'position' => 'ผู้อำนวยการฝ่ายขาย', 'branch_id' => null, 'code' => 'EMP002'],
            // หัวหน้างาน
            ['name' => 'ประยุทธ์ ทองดี', 'email' => 'prayuth@wooddoor.co.th', 'role' => 'supervisor', 'position' => 'หัวหน้างาน ภาค กทม.', 'branch_id' => 1, 'code' => 'EMP003'],
            ['name' => 'วิไล สุขสวัสดิ์', 'email' => 'wilai@wooddoor.co.th', 'role' => 'supervisor', 'position' => 'หัวหน้างาน ภาคเหนือ', 'branch_id' => 3, 'code' => 'EMP004'],
            ['name' => 'ธนพล จันทร์เพ็ญ', 'email' => 'thanapol@wooddoor.co.th', 'role' => 'supervisor', 'position' => 'หัวหน้างาน ภาคใต้', 'branch_id' => 5, 'code' => 'EMP005'],
            // PC (Product Consultants)
            ['name' => 'มานี รักดี', 'email' => 'manee@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 1, 'code' => 'PC001'],
            ['name' => 'มานะ ใจสู้', 'email' => 'mana@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 1, 'code' => 'PC002'],
            ['name' => 'ปิติ สุขใจ', 'email' => 'piti@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 2, 'code' => 'PC003'],
            ['name' => 'สมศรี ดีงาม', 'email' => 'somsri@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 2, 'code' => 'PC004'],
            ['name' => 'อรุณ แจ่มใส', 'email' => 'arun@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 3, 'code' => 'PC005'],
            ['name' => 'กมลา สดใส', 'email' => 'kamala@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 4, 'code' => 'PC006'],
            ['name' => 'วิชัย ภูมิใจ', 'email' => 'wichai@wooddoor.co.th', 'role' => 'pc', 'position' => 'PC ประจำสาขา', 'branch_id' => 5, 'code' => 'PC007'],
        ];

        $employees = [];
        foreach ($usersData as $ud) {
            $user = User::create([
                'name' => $ud['name'],
                'email' => $ud['email'],
                'password' => Hash::make('password123'),
            ]);
            $emp = Employee::create([
                'user_id' => $user->id,
                'branch_id' => $ud['branch_id'],
                'employee_code' => $ud['code'],
                'position' => $ud['position'],
                'role' => $ud['role'],
                'phone' => '08' . rand(10000000, 99999999),
            ]);
            $employees[$ud['code']] = $emp;
        }

        // === ข้อมูลลงเวลา (Attendance) ===
        $pcCodes = ['PC001', 'PC002', 'PC003', 'PC004', 'PC005', 'PC006', 'PC007'];
        $statuses = ['present', 'present', 'present', 'present', 'present', 'late', 'leave'];

        for ($day = 0; $day < 14; $day++) {
            $date = Carbon::now()->subDays($day);
            if ($date->isWeekend()) continue;

            foreach ($pcCodes as $code) {
                $status = $statuses[array_rand($statuses)];
                $clockIn = $status === 'late' ? '09:' . rand(15, 45) . ':00' : '08:' . str_pad(rand(45, 59), 2, '0', STR_PAD_LEFT) . ':00';
                $clockOut = $day < 2 && rand(0, 2) === 0 ? null : rand(17, 19) . ':' . str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT) . ':00';
                $otHours = ($clockOut && intval(substr($clockOut, 0, 2)) > 17) ? intval(substr($clockOut, 0, 2)) - 17 + (intval(substr($clockOut, 3, 2)) / 60) : 0;

                if ($status !== 'leave') {
                    Attendance::create([
                        'employee_id' => $employees[$code]->id,
                        'date' => $date->format('Y-m-d'),
                        'clock_in' => $status === 'leave' ? null : $clockIn,
                        'clock_out' => $clockOut,
                        'ot_hours' => round($otHours, 1),
                        'status' => $status,
                        'note' => $status === 'late' ? 'รถติด' : null,
                    ]);
                } else {
                    Attendance::create([
                        'employee_id' => $employees[$code]->id,
                        'date' => $date->format('Y-m-d'),
                        'status' => 'leave',
                        'note' => 'ลาป่วย',
                    ]);
                }
            }
        }

        // === รายงานการขาย (Sales Reports) ===
        $products = [
            ['name' => 'ประตูไม้สักทอง รุ่น Royal', 'code' => 'WD-R001', 'category' => 'ประตูไม้สักทอง', 'price' => 35000],
            ['name' => 'ประตูไม้สักทอง รุ่น Classic', 'code' => 'WD-C001', 'category' => 'ประตูไม้สักทอง', 'price' => 28000],
            ['name' => 'ประตูไม้เนื้อแข็ง รุ่น Modern', 'code' => 'WD-M001', 'category' => 'ประตูไม้เนื้อแข็ง', 'price' => 18000],
            ['name' => 'ประตูไม้เนื้อแข็ง รุ่น Premium', 'code' => 'WD-P001', 'category' => 'ประตูไม้เนื้อแข็ง', 'price' => 22000],
            ['name' => 'ประตูไม้อัด HDF', 'code' => 'WD-H001', 'category' => 'ประตูไม้อัด', 'price' => 8500],
            ['name' => 'ประตูไม้อัดลามิเนต', 'code' => 'WD-L001', 'category' => 'ประตูไม้อัด', 'price' => 6500],
            ['name' => 'วงกบไม้สักทอง', 'code' => 'FR-S001', 'category' => 'วงกบ', 'price' => 12000],
            ['name' => 'บานเลื่อนไม้สัก', 'code' => 'SL-S001', 'category' => 'บานเลื่อน', 'price' => 45000],
        ];
        $paymentMethods = ['cash', 'transfer', 'credit_card', 'installment'];
        $saleStatuses = ['pending', 'confirmed', 'confirmed', 'delivered', 'delivered'];

        foreach ($pcCodes as $code) {
            $emp = $employees[$code];
            for ($day = 0; $day < 30; $day++) {
                $date = Carbon::now()->subDays($day);
                if ($date->isWeekend()) continue;
                $salesCount = rand(0, 3);
                for ($s = 0; $s < $salesCount; $s++) {
                    $product = $products[array_rand($products)];
                    $qty = rand(1, 3);
                    SalesReport::create([
                        'employee_id' => $emp->id,
                        'branch_id' => $emp->branch_id,
                        'report_date' => $date->format('Y-m-d'),
                        'product_name' => $product['name'],
                        'product_code' => $product['code'],
                        'category' => $product['category'],
                        'quantity' => $qty,
                        'unit_price' => $product['price'],
                        'total_amount' => $product['price'] * $qty,
                        'customer_name' => 'ลูกค้า ' . rand(100, 999),
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                        'status' => $saleStatuses[array_rand($saleStatuses)],
                    ]);
                }
            }
        }

        // === โฟลงาน (Workflows) ===
        $wf1 = Workflow::create([
            'title' => 'จัดโปรโมชั่นลดราคาประตูไม้สัก 30% - เซ็นทรัล ลาดพร้าว',
            'description' => 'แคมเปญลดราคาประตูไม้สักทอง 30% สำหรับงาน Home Expo 2025 ที่เซ็นทรัล ลาดพร้าว ต้องจัดบูทโชว์ ติดป้าย และเตรียมสต๊อก',
            'created_by' => $employees['EMP003']->id,
            'branch_id' => 1,
            'type' => 'promotion',
            'priority' => 'high',
            'status' => 'in_progress',
            'progress_percent' => 60,
            'start_date' => Carbon::now()->subDays(7),
            'due_date' => Carbon::now()->addDays(3),
        ]);
        $wf1Steps = [
            ['order' => 1, 'title' => 'เตรียมสต๊อกประตูโชว์ 10 บาน', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['PC001']->id],
            ['order' => 2, 'title' => 'ติดตั้งป้ายโปรโมชั่นและราคา', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['PC001']->id],
            ['order' => 3, 'title' => 'จัดบูทโชว์หน้าร้าน', 'status' => 'in_progress', 'progress_percent' => 70, 'assigned_to' => $employees['PC002']->id],
            ['order' => 4, 'title' => 'ถ่ายรูปรายงานความคืบหน้า', 'status' => 'in_progress', 'progress_percent' => 50, 'assigned_to' => $employees['PC001']->id],
            ['order' => 5, 'title' => 'เปิดขายและรายงานยอด', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC002']->id],
        ];
        foreach ($wf1Steps as $step) {
            WorkflowStep::create(array_merge($step, ['workflow_id' => $wf1->id]));
        }

        $wf2 = Workflow::create([
            'title' => 'แก้ปัญหาสต๊อกไม่ตรง - เมกาบางนา',
            'description' => 'สต๊อกประตูไม้เนื้อแข็งในระบบไม่ตรงกับหน้าร้าน ต้องตรวจนับและปรับปรุง',
            'created_by' => $employees['EMP003']->id,
            'branch_id' => 2,
            'type' => 'problem_solving',
            'priority' => 'urgent',
            'status' => 'in_progress',
            'progress_percent' => 30,
            'start_date' => Carbon::now()->subDays(3),
            'due_date' => Carbon::now()->addDays(1),
        ]);
        $wf2Steps = [
            ['order' => 1, 'title' => 'ตรวจนับสต๊อกจริงในร้าน', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['PC003']->id],
            ['order' => 2, 'title' => 'เปรียบเทียบกับระบบ', 'status' => 'in_progress', 'progress_percent' => 50, 'assigned_to' => $employees['PC003']->id],
            ['order' => 3, 'title' => 'ปรับปรุงข้อมูลในระบบ', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC004']->id],
            ['order' => 4, 'title' => 'รายงานผลให้หัวหน้า', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC003']->id],
        ];
        foreach ($wf2Steps as $step) {
            WorkflowStep::create(array_merge($step, ['workflow_id' => $wf2->id]));
        }

        $wf3 = Workflow::create([
            'title' => 'ประสานงานข้ามสาขา - ย้ายสต๊อกจาก เชียงใหม่ ไป ขอนแก่น',
            'description' => 'สาขาขอนแก่นสต๊อกประตูไม้สักหมด ต้องย้ายจากสาขาเชียงใหม่ที่มีเยอะ',
            'created_by' => $employees['EMP001']->id,
            'branch_id' => null,
            'type' => 'cross_branch',
            'priority' => 'high',
            'status' => 'active',
            'progress_percent' => 20,
            'start_date' => Carbon::now()->subDays(2),
            'due_date' => Carbon::now()->addDays(5),
        ]);
        $wf3Steps = [
            ['order' => 1, 'title' => 'ตรวจสอบสต๊อกสาขาเชียงใหม่', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['PC005']->id],
            ['order' => 2, 'title' => 'ประสานงานขนส่ง', 'status' => 'in_progress', 'progress_percent' => 40, 'assigned_to' => $employees['EMP004']->id],
            ['order' => 3, 'title' => 'รับสินค้าที่สาขาขอนแก่น', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC006']->id],
            ['order' => 4, 'title' => 'ตรวจนับและยืนยันการรับ', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC006']->id],
        ];
        foreach ($wf3Steps as $step) {
            WorkflowStep::create(array_merge($step, ['workflow_id' => $wf3->id]));
        }

        $wf4 = Workflow::create([
            'title' => 'เปิดโซนโชว์รูมใหม่ - เซ็นทรัล ภูเก็ต',
            'description' => 'ขยายพื้นที่โชว์รูมประตูไม้พรีเมียมที่สาขาภูเก็ต เพิ่มบานโชว์ 15 รุ่น',
            'created_by' => $employees['EMP005']->id,
            'branch_id' => 5,
            'type' => 'project',
            'priority' => 'medium',
            'status' => 'in_progress',
            'progress_percent' => 45,
            'start_date' => Carbon::now()->subDays(10),
            'due_date' => Carbon::now()->addDays(10),
        ]);
        $wf4Steps = [
            ['order' => 1, 'title' => 'วัดพื้นที่และออกแบบเลย์เอาท์', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['EMP005']->id],
            ['order' => 2, 'title' => 'สั่งสต๊อกบานโชว์ 15 รุ่น', 'status' => 'completed', 'progress_percent' => 100, 'assigned_to' => $employees['PC007']->id],
            ['order' => 3, 'title' => 'ติดตั้งชั้นวางและอุปกรณ์', 'status' => 'in_progress', 'progress_percent' => 60, 'assigned_to' => $employees['PC007']->id],
            ['order' => 4, 'title' => 'จัดวางบานโชว์และป้ายราคา', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC007']->id],
            ['order' => 5, 'title' => 'ถ่ายรูปรายงานและเปิดขาย', 'status' => 'pending', 'progress_percent' => 0, 'assigned_to' => $employees['PC007']->id],
        ];
        foreach ($wf4Steps as $step) {
            WorkflowStep::create(array_merge($step, ['workflow_id' => $wf4->id]));
        }

        // === ปัญหา (Problems) ===
        $p1 = Problem::create([
            'title' => 'ประตูโชว์ไม่ถูกนำมาวาง - เซ็นทรัล ลาดพร้าว',
            'description' => 'สต๊อกประตูไม้สักทอง รุ่น Royal มาถึงแล้วแต่ไม่ได้นำมาจัดโชว์ตามแผน ลูกค้าสอบถามแต่ไม่มีของให้ดู',
            'reported_by' => $employees['PC001']->id,
            'branch_id' => 1,
            'assigned_to' => $employees['EMP003']->id,
            'workflow_id' => $wf1->id,
            'category' => 'stock_display',
            'priority' => 'high',
            'status' => 'in_progress',
            'progress_percent' => 60,
        ]);
        ProblemComment::create(['problem_id' => $p1->id, 'employee_id' => $employees['PC001']->id, 'comment' => 'ตรวจสอบแล้ว สต๊อกอยู่ในคลังหลังร้าน ยังไม่ได้เคลื่อนย้ายมาหน้าร้าน', 'progress_update' => 20, 'created_at' => Carbon::now()->subDays(2)]);
        ProblemComment::create(['problem_id' => $p1->id, 'employee_id' => $employees['EMP003']->id, 'comment' => 'ให้ PC ย้ายออกมาจัดโชว์ภายในวันนี้ แจ้งช่างมาช่วยติดตั้ง', 'progress_update' => 40, 'created_at' => Carbon::now()->subDays(1)]);
        ProblemComment::create(['problem_id' => $p1->id, 'employee_id' => $employees['PC001']->id, 'comment' => 'ย้ายมาแล้ว 6 บาน เหลืออีก 4 บาน รอช่างมาติดตั้งพรุ่งนี้', 'progress_update' => 60]);

        $p2 = Problem::create([
            'title' => 'ป้ายโปรโมชั่นหมดอายุแต่ยังติดอยู่ - เมกาบางนา',
            'description' => 'ป้ายโปรโมชั่นลด 20% ของเดือนที่แล้วยังติดอยู่ ลูกค้าเข้ามาถามได้ราคาเก่า ทำให้เกิดปัญหากับลูกค้า',
            'reported_by' => $employees['PC003']->id,
            'branch_id' => 2,
            'assigned_to' => $employees['EMP003']->id,
            'category' => 'promotion',
            'priority' => 'urgent',
            'status' => 'acknowledged',
            'progress_percent' => 10,
        ]);
        ProblemComment::create(['problem_id' => $p2->id, 'employee_id' => $employees['EMP003']->id, 'comment' => 'รับทราบแล้ว ให้ PC ถอดป้ายเก่าออกทันที และเปลี่ยนเป็นป้ายราคาปัจจุบัน', 'progress_update' => 10]);

        Problem::create([
            'title' => 'ประตูตัวอย่างมีรอยขีดข่วน - เชียงใหม่',
            'description' => 'ประตูไม้สักทอง รุ่น Classic ที่โชว์มีรอยขีดข่วนจากลูกค้าเปิด-ปิดทดลอง จำเป็นต้องเปลี่ยนใหม่',
            'reported_by' => $employees['PC005']->id,
            'branch_id' => 3,
            'assigned_to' => $employees['EMP004']->id,
            'category' => 'product_damage',
            'priority' => 'medium',
            'status' => 'open',
            'progress_percent' => 0,
        ]);

        $p4 = Problem::create([
            'title' => 'สต๊อกประตู HDF ไม่เพียงพอ - ขอนแก่น',
            'description' => 'ลูกค้าสั่งซื้อประตูไม้อัด HDF 20 บาน แต่สต๊อกมีเพียง 5 บาน ต้องรอเติมสต๊อก',
            'reported_by' => $employees['PC006']->id,
            'branch_id' => 4,
            'assigned_to' => $employees['EMP001']->id,
            'category' => 'stock_display',
            'priority' => 'high',
            'status' => 'in_progress',
            'progress_percent' => 40,
        ]);
        ProblemComment::create(['problem_id' => $p4->id, 'employee_id' => $employees['EMP001']->id, 'comment' => 'สั่งเติมสต๊อกจากโรงงานแล้ว จะถึงภายใน 3 วัน', 'progress_update' => 40]);

        // === การสื่อสาร (Communications) ===
        $c1 = Communication::create([
            'subject' => 'แจ้งเตือน: แคมเปญ Home Expo 2025 เริ่มสัปดาห์หน้า',
            'message' => "แจ้งทุกสาขาเตรียมความพร้อมสำหรับแคมเปญ Home Expo 2025\n\n1. ตรวจสอบสต๊อกให้เพียงพอ\n2. จัดเตรียมบูทโชว์\n3. ติดป้ายโปรโมชั่นใหม่\n4. ส่งรายงานภาพถ่ายหน้างานภายในวันศุกร์\n\nขอให้ทุกสาขาดำเนินการและรายงานกลับ",
            'from_employee' => $employees['EMP001']->id,
            'from_branch' => null,
            'type' => 'announcement',
            'status' => 'sent',
        ]);
        foreach ([1, 2, 3, 4, 5] as $branchId) {
            CommunicationRecipient::create(['communication_id' => $c1->id, 'branch_id' => $branchId, 'is_read' => $branchId <= 3]);
        }
        CommunicationReply::create(['communication_id' => $c1->id, 'employee_id' => $employees['PC001']->id, 'message' => 'สาขาเซ็นทรัล ลาดพร้าว รับทราบแล้วครับ เตรียมการเรียบร้อย', 'created_at' => Carbon::now()->subHours(5)]);
        CommunicationReply::create(['communication_id' => $c1->id, 'employee_id' => $employees['PC005']->id, 'message' => 'สาขาเชียงใหม่ รับทราบค่ะ แต่สต๊อกรุ่น Royal เหลือน้อย อาจต้องขอเพิ่ม', 'created_at' => Carbon::now()->subHours(3)]);

        $c2 = Communication::create([
            'subject' => 'ขอประสานย้ายสต๊อกจากเชียงใหม่ไปขอนแก่น',
            'message' => 'สาขาขอนแก่นสต๊อกประตูไม้สักหมด ต้องการ 10 บาน ขอให้สาขาเชียงใหม่เตรียมสต๊อกสำหรับย้าย กรุณาแจ้งยืนยันจำนวนที่ส่งได้',
            'from_employee' => $employees['EMP001']->id,
            'type' => 'coordination',
            'status' => 'replied',
        ]);
        CommunicationRecipient::create(['communication_id' => $c2->id, 'branch_id' => 3, 'is_read' => true]);
        CommunicationRecipient::create(['communication_id' => $c2->id, 'branch_id' => 4, 'is_read' => true]);
        CommunicationReply::create(['communication_id' => $c2->id, 'employee_id' => $employees['EMP004']->id, 'message' => 'สาขาเชียงใหม่ยืนยัน สามารถส่งได้ 8 บาน พร้อมจัดส่งวันจันทร์ค่ะ']);

        $c3 = Communication::create([
            'subject' => 'ฟีดแบ็ค: ลูกค้าชมชอบโชว์รูมใหม่ สาขาภูเก็ต',
            'message' => 'ลูกค้าหลายรายชื่นชมโชว์รูมใหม่ที่สาขาภูเก็ต บอกว่าจัดสวยมาก เห็นของจริงแล้วตัดสินใจง่ายขึ้น ยอดขายเพิ่มขึ้น 15% ในสัปดาห์แรก',
            'from_employee' => $employees['PC007']->id,
            'from_branch' => 5,
            'type' => 'feedback',
            'status' => 'read',
        ]);
        CommunicationRecipient::create(['communication_id' => $c3->id, 'employee_id' => $employees['EMP001']->id, 'is_read' => true]);
        CommunicationRecipient::create(['communication_id' => $c3->id, 'employee_id' => $employees['EMP005']->id, 'is_read' => true]);
    }
}
