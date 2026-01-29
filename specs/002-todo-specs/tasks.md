# Tasks: Todo Application

**Input**: Design documents from `/specs/002-todo-specs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure with requirements.txt
- [X] T002 Create frontend directory structure with package.json
- [X] T003 [P] Initialize backend with FastAPI, SQLModel, and Pydantic dependencies
- [X] T004 [P] Initialize frontend with Next.js, TypeScript, Tailwind CSS, and Better Auth dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T005 Setup database connection and session management in backend/db.py
- [X] T006 [P] Implement JWT authentication middleware in backend/middleware/auth.py
- [X] T007 [P] Setup API routing structure in backend/main.py
- [X] T008 Create base models including Task model in backend/models.py
- [X] T009 Configure error handling and logging infrastructure in backend/main.py
- [X] T010 Setup environment configuration management in backend/.env

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Allow users to sign up for an account and log in, so that they can securely access their personal todo list.

**Independent Test**: Can be fully tested by registering a new user, logging in, and verifying access to a protected page.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [X] T011 [P] [US1] Contract test for authentication endpoints in backend/tests/test_auth_contract.py
- [X] T012 [P] [US1] Integration test for user registration and login in backend/tests/test_auth_integration.py

### Implementation for User Story 1

- [X] T013 [P] [US1] Create User model in backend/models.py (using Better Auth)
- [X] T014 [P] [US1] Create Task model in backend/models.py
- [X] T015 [US1] Implement authentication service in backend/services/auth_service.py
- [X] T016 [US1] Implement authentication endpoints in backend/routes/auth.py
- [X] T017 [US1] Create login page component in frontend/app/login/page.tsx
- [X] T018 [US1] Create signup page component in frontend/app/signup/page.tsx
- [X] T019 [US1] Implement Better Auth client setup in frontend/lib/auth.ts
- [X] T020 [US1] Add protected route validation for authentication

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P2)

**Goal**: Allow logged-in users to create new tasks and view their existing tasks, so that they can manage their to-dos.

**Independent Test**: Can be fully tested by creating tasks and viewing them in the task list.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T021 [P] [US2] Contract test for task endpoints in backend/tests/test_task_contract.py
- [X] T022 [P] [US2] Integration test for task creation and viewing in backend/tests/test_task_integration.py

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement task service in backend/services/task_service.py
- [X] T024 [US2] Implement task endpoints in backend/routes/tasks.py
- [X] T025 [US2] Create AddTaskForm component in frontend/components/AddTaskForm.tsx
- [X] T026 [US2] Create TaskList component in frontend/components/TaskList.tsx
- [X] T027 [US2] Create TaskItem component in frontend/components/TaskItem.tsx
- [X] T028 [US2] Create API client for tasks in frontend/lib/api.ts
- [X] T029 [US2] Integrate task creation and viewing with User Story 1 authentication

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update and Delete Tasks (Priority: P3)

**Goal**: Allow logged-in users to update and delete their tasks, so that they can keep their todo list accurate and organized.

**Independent Test**: Can be fully tested by updating task details and deleting tasks.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T030 [P] [US3] Contract test for update/delete endpoints in backend/tests/test_task_update_contract.py
- [ ] T031 [P] [US3] Integration test for task update and delete in backend/tests/test_task_update_integration.py

### Implementation for User Story 3

- [ ] T032 [P] [US3] Enhance task service with update/delete methods in backend/services/task_service.py
- [ ] T033 [US3] Enhance task endpoints with update/delete functionality in backend/routes/tasks.py
- [ ] T034 [US3] Create TaskEditForm component in frontend/components/TaskEditForm.tsx
- [ ] T035 [US3] Add delete confirmation functionality in frontend/components/TaskItem.tsx
- [ ] T036 [US3] Update API client for update/delete operations in frontend/lib/tasks.ts
- [ ] T037 [US3] Integrate update and delete with User Story 1 authentication and User Story 2 components

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Mark Tasks Complete (Priority: P4)

**Goal**: Allow logged-in users to mark tasks as complete/incomplete, so that they can track their progress.

**Independent Test**: Can be fully tested by toggling task completion status and seeing the visual change.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T038 [P] [US4] Contract test for completion toggle endpoint in backend/tests/test_completion_contract.py
- [ ] T039 [P] [US4] Integration test for task completion toggle in backend/tests/test_completion_integration.py

### Implementation for User Story 4

- [ ] T040 [P] [US4] Enhance task service with completion toggle in backend/services/task_service.py
- [ ] T041 [US4] Implement completion toggle endpoint in backend/routes/tasks.py
- [ ] T042 [US4] Create TaskCheckbox component in frontend/components/TaskCheckbox.tsx
- [ ] T043 [US4] Update TaskItem component to include completion toggle in frontend/components/TaskItem.tsx
- [ ] T044 [US4] Update API client for completion operations in frontend/lib/tasks.ts
- [ ] T045 [US4] Integrate completion functionality with existing components

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T046 [P] Documentation updates in frontend/README.md and backend/README.md
- [X] T047 Create dashboard page in frontend/app/dashboard/page.tsx
- [X] T048 Create navigation component in frontend/components/Navbar.tsx
- [X] T049 Add loading states to all async operations in frontend components
- [X] T050 Add error handling and user feedback to all operations in frontend components
- [X] T051 Add responsive design to all components using Tailwind CSS
- [X] T052 Run quickstart.md validation to ensure everything works together

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for authentication
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for authentication and US2 for basic task functionality
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US1 for authentication and US2 for basic task functionality

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for authentication endpoints in backend/tests/test_auth_contract.py"
Task: "Integration test for user registration and login in backend/tests/test_auth_integration.py"

# Launch all models for User Story 1 together:
Task: "Create User model in backend/models.py (using Better Auth)"
Task: "Create Task model in backend/models.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence