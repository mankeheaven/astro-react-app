import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { CreateUserInput, User } from "../types/user";
import toast from "../utils/toast";

const UserForm: React.FC = () => {
	const [formData, setFormData] = useState<CreateUserInput>({
		name: "",
		email: "",
		message: "",
	});
	const [submitMessage, setSubmitMessage] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState<{
		show: boolean;
		user: User | null;
	}>({ show: false, user: null });

	// 使用自定义 Hook 管理用户状态
	const {
		users,
		loading,
		error,
		createUser,
		deleteUser,
		checkEmailAvailability,
		clearError,
	} = useUsers();

	// 处理表单输入
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev: CreateUserInput) => ({
			...prev,
			[name]: value,
		}));

		// 清除之前的错误和提交消息
		if (error) clearError();
		if (submitMessage) setSubmitMessage("");
	};

	// 处理邮箱失焦事件，检查邮箱可用性
	const handleEmailBlur = async () => {
		if (formData.email && formData.email.includes("@")) {
			try {
				const result = await checkEmailAvailability(formData.email);
				if (!result) {
					setSubmitMessage("该邮箱已被注册，请使用其他邮箱");
				}
			} catch (error) {
				// 静默处理邮箱检查错误
				console.warn("邮箱检查失败:", error);
			}
		}
	};

	// 处理表单提交
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitMessage("");

		try {
			const result = await createUser(formData);
			
			if(result){
				setSubmitMessage("注册成功！");
				setFormData({ name: "", email: "", message: "" });
				toast.success("用户注册成功！");
			}
		} catch (error) {
			setSubmitMessage("网络错误，请稍后重试");
			console.error("提交失败:", error);
		}
	};

	// 显示删除确认对话框
	const showDeleteConfirm = (user: User) => {
		setDeleteConfirm({ show: true, user });
	};

	// 隐藏删除确认对话框
	const hideDeleteConfirm = () => {
		setDeleteConfirm({ show: false, user: null });
	};

	// 处理用户删除
	const handleDeleteUser = async () => {
		if (!deleteConfirm.user) return;

		try {
			await deleteUser(deleteConfirm.user.id);
			toast.success(`用户 "${deleteConfirm.user.name}" 删除成功！`);
			hideDeleteConfirm();
		} catch (error) {
			toast.error("删除用户失败，请重试");
			console.error("删除失败:", error);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			{/* 用户注册表单 */}
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">用户注册</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							姓名
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							minLength={2}
							maxLength={50}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="请输入您的姓名"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							邮箱
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							onBlur={handleEmailBlur}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="请输入您的邮箱地址"
						/>
					</div>

					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							消息
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleInputChange}
							required
							minLength={10}
							maxLength={500}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="请输入您的消息（至少10个字符）"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "提交中..." : "注册"}
					</button>
				</form>
			</div>

			{/* 用户列表 */}
			<div className="bg-white rounded-lg shadow-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">用户列表</h2>
					{users.length > 0 && (
						<span className="text-sm text-gray-500">
							共 {users.length} 个用户
						</span>
					)}
				</div>

				{loading && users.length === 0 ? (
					<div className="text-center py-8">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-2 text-gray-500">加载中...</p>
					</div>
				) : users.length === 0 ? (
					<p className="text-gray-500 text-center py-4">暂无用户数据</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{users.map((user: User) => (
							<div
								key={user.id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
							>
								{/* 删除按钮 */}
								<button
									onClick={() => showDeleteConfirm(user)}
									className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center text-xs font-bold"
									title={`删除用户 ${user.name}`}
								>
									×
								</button>

								<h3 className="font-semibold text-lg text-gray-800 pr-8">
									{user.name}
								</h3>
								<p className="text-gray-600 text-sm">{user.email}</p>
								{user.message && (
									<p className="text-gray-700 text-sm mt-2 line-clamp-3">
										{user.message}
									</p>
								)}
								<p className="text-gray-400 text-xs mt-2">
									注册时间:{" "}
									{new Date(user.createdAt).toLocaleDateString("zh-CN", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* 删除确认对话框 */}
			{deleteConfirm.show && deleteConfirm.user && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							确认删除用户
						</h3>
						<p className="text-gray-600 mb-6">
							您确定要删除用户 <strong>"{deleteConfirm.user.name}"</strong> 吗？
							<br />
							<span className="text-sm text-gray-500">
								邮箱: {deleteConfirm.user.email}
							</span>
							<br />
							<span className="text-red-500 text-sm font-medium">
								此操作不可撤销！
							</span>
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={hideDeleteConfirm}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
							>
								取消
							</button>
							<button
								onClick={handleDeleteUser}
								disabled={loading}
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{loading ? "删除中..." : "确认删除"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserForm;
