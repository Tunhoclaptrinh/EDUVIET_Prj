import React, { useEffect, useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useModel } from 'umi';

interface LessonSelectProps {
	value?: string | number;
	onChange?: (val: string | number) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large';
	sectionId?: number | string; // Filter by section
	approvedOnly?: boolean; // Only show approved lessons
	defaultFirst?: boolean;
}

const LessonSelect: React.FC<LessonSelectProps> = ({
	value,
	onChange,
	placeholder = 'Chọn bài học',
	disabled = false,
	allowClear = true,
	style = { width: '100%' },
	size = 'middle',
	sectionId,
	approvedOnly = false,
	defaultFirst = false,
}) => {
	const { danhSach, getAllModel } = useModel('course.lesson');
	const [loading, setLoading] = useState(false);

	// Lấy danh sách bài học
	useEffect(() => {
		const fetchLessons = async () => {
			try {
				setLoading(true);
				const res = await getAllModel();
				if (defaultFirst && onChange && res?.length > 0 && !value) {
					const filteredLessons = getFilteredLessons(res);
					if (filteredLessons.length > 0) {
						onChange(filteredLessons[0].id);
					}
				}
			} catch (error) {
				message.error('Không thể tải danh sách bài học');
			} finally {
				setLoading(false);
			}
		};

		fetchLessons();
	}, [getAllModel, onChange, defaultFirst, value, sectionId, approvedOnly]);

	// Helper function to filter lessons
	const getFilteredLessons = (lessons: Lesson.IRecord[]) => {
		let filtered = [...lessons];

		// Filter by section if provided
		if (sectionId) {
			filtered = filtered.filter((lesson: Lesson.IRecord) => String(lesson.section_id) === String(sectionId));
		}

		// Filter by approved status if required
		if (approvedOnly) {
			filtered = filtered.filter((lesson: Lesson.IRecord) => lesson.status === 'approved');
		}

		// Sort by order_number
		filtered.sort((a: Lesson.IRecord, b: Lesson.IRecord) => a.order_number - b.order_number);

		return filtered;
	};

	// Lọc bài học theo điều kiện
	const filteredLessons = useMemo(() => {
		return getFilteredLessons(danhSach);
	}, [danhSach, sectionId, approvedOnly]);

	// Tạo options cho Select
	const options = useMemo(() => {
		return filteredLessons.map((lesson: Lesson.IRecord) => {
			// Create display label with order number and title
			const label = `#${lesson.order_number} - ${lesson.title}`;

			return {
				value: lesson.id,
				label: label,
				// Add additional data for search
				searchText: `${lesson.title} ${lesson.description || ''}`.toLowerCase(),
			};
		});
	}, [filteredLessons]);

	return (
		<Select
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder}
			style={style}
			size={size}
			disabled={disabled}
			allowClear={allowClear}
			loading={loading}
			filterOption={(input, option) => {
				const searchInput = input.toLowerCase();
				return (
					((option?.label as string)?.toLowerCase().includes(searchInput) ||
						(option as any)?.searchText?.includes(searchInput)) ??
					false
				);
			}}
			notFoundContent={loading ? 'Đang tải...' : 'Không tìm thấy bài học nào'}
		/>
	);
};

export default LessonSelect;
